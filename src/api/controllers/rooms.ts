import { Get, Route } from "tsoa";
import { Room, RoomFacilities } from "../../models/room";
import { HotelFacilities } from "../../models/hotel";
import { Reservation } from "../../models/reservation";
import { query } from "express-validator";
import { AppDataSource } from "../../database";

export enum roomsFindRequestSort {
    DATE = <any>"date",
    PRICE = <any>"price",
}

export interface roomsFindRequest {
    from: Date;
    to: Date;
    places: number,
    limit?: number,
    page?: number,
    order?: roomsFindRequestSort | null,
    desc?: boolean | null,
    roomFacilities?: RoomFacilities[] | null,
    hotelFacilities?: HotelFacilities[] | null
}

export interface roomsFindResponse {
    rooms: Room[]
}

export const roomsFindValidator = [
    query("from").exists().trim().isDate().isAfter((new Date()).toString()),
    query("to").exists().trim().isDate().isAfter((new Date()).toString()).custom((sd, { req }) => {
        const from: Date = new Date(req.query.from ?? null);
        const to: Date = new Date(sd);
        if (to <= from) {
            throw new Error('End date must be greater than start date');
        }
        return true;
    }),
    query("places").exists().isInt({ gt: 0 }),
    query("limit").isInt({ gt: 0, lt: parseInt(process.env.API_ROOMS_LIMIT as string) || 100 }).optional(true),
    query("page").optional(true).isInt({ gt: 0, lt: 100 }),
    query("order").optional(true).trim().isIn(Object.values(roomsFindRequestSort)),
    query("desc").optional(true).trim().isBoolean(),
    // TODO: room and hotel facilities
];

@Route("rooms")
export class ControllerRooms {
    @Get("find")
    public async find(req: roomsFindRequest): Promise<roomsFindResponse> {
        const manager = AppDataSource.manager;
        const limit: number = (req.limit || parseInt(process.env.API_ROOMS_LIMIT as string)) || 100;
        const page: number = req.page || 1;
        const order: string = req.order || roomsFindRequestSort.DATE;
        const rooms: Room[] = await manager.createQueryBuilder(Room, 'room')
            .innerJoinAndSelect("room.hotel", "hotel")
            .where("isActive = :active", { active: true })
            .andWhere("places >= :places", { places: req.places })
            .orderBy(order, req.desc ? "ASC" : "DESC")
            .limit(limit)
            .offset((page - 1) * limit)
            .getMany();

        return {
            rooms: rooms
        };
    }
}