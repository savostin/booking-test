import { Get, Route } from "tsoa";
import { Room, RoomFacilities } from "../../models/room";
import { HotelFacilities } from "../../models/hotel";
import { Reservation } from "../../models/reservation";
import { query } from "express-validator";
import { AppDataSource, Brackets } from "../../database";

export interface roomFindRequest {
    from: Date;
    to: Date;
    places: number,
    limit?: number,
    page?: number,
    roomFacilities?: RoomFacilities[] | null,
    hotelFacilities?: HotelFacilities[] | null
}

export interface roomFindResponse {
    rooms: Room[]
}

export const roomFindValidator = [
    query("from").exists().trim().isDate().isAfter((new Date()).toString()),
    query("to").exists().trim().isDate().isAfter((new Date()).toString()).custom((sd, { req }) => {
        const from: Date = new Date(req.query?.from ?? null);
        const to: Date = new Date(sd);
        if (to <= from) {
            throw new Error('End date must be greater than start date');
        }
        return true;
    }),
    query("places").exists().isInt({ gt: 0 }),
    query("limit").isInt({ gt: 0, lt: parseInt(process.env.API_ROOMS_LIMIT as string) || 100 }).optional(true),
    query("page").optional(true).isInt({ gt: 0, lt: 100 }),
    // TODO check order by and desc when added
    // TODO: room and hotel facilities
];

@Route("room")
export class ControllerRoom {
    @Get("find")
    public async find(req: roomFindRequest): Promise<roomFindResponse> {
        const manager = AppDataSource.manager;
        const limit: number = (req.limit || parseInt(process.env.API_ROOMS_LIMIT as string)) || 10;
        const page: number = req.page || 1;

        const rooms: Room[] = await manager.getRepository(Room).createQueryBuilder('room')
            .innerJoinAndSelect("room.hotel", "hotel")
            .where("isActive = 1")
            .andWhere("places >= :places", { places: req.places })
            .andWhere(db => `room.id NOT IN (${db.subQuery()
                .select('roomId')
                .from(Reservation, 'reservations')
                .where(new Brackets((qb) => {
                    qb.where('fromDate BETWEEN :from AND :to', { from: req.from.toDateString(), to: req.to.toDateString() })
                        .orWhere('toDate BETWEEN :from AND :to', { from: req.from.toDateString(), to: req.to.toDateString() })
                })
                )
                .andWhere('status NOT IN (:...status)', { status: ['CANCELLED', 'CREATED'] })
                .getQuery()})`)

            .skip((page - 1) * limit)
            .take(limit)
            .cache(parseInt(process.env.API_ROOMS_CACHE as string) || 1000)
            .getMany();

        return {
            rooms: rooms
        };
    }
}