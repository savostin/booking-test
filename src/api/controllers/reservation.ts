import { Get, Route } from "tsoa";
import { Room } from "../../models/room";
import { Reservation } from "../../models/reservation";
import { body } from "express-validator";
import { AppDataSource, Brackets } from "../../database";
import { User } from "../../models/user";

export interface reservationMakeRequest {
    from: Date;
    to: Date;
    places: number,
    roomId: number,
    user: User
}

export interface reservationMakeResponse {
    result: Reservation
}

export const reservationMakeValidator = [
    body("from").exists().trim().isDate().isAfter((new Date()).toString()),
    body("to").exists().trim().isDate().isAfter((new Date()).toString()).custom((sd, { req }) => {
        const from: Date = new Date(req.query?.from ?? null);
        const to: Date = new Date(sd);
        if (to <= from) {
            throw new Error('End date must be greater than start date');
        }
        return true;
    }),
    body("places").exists().isInt({ gt: 0 }),
    body("roomId").exists().isInt({ gt: 0 }),
];


export interface reservationChangeRequest {
    from: Date;
    to: Date;
    places: number,
    reservationId: number,
}

export interface reservationChangeResponse {
    result: Reservation
}

export const reservationChangeValidator = [
    body("from").exists().trim().isDate().isAfter((new Date()).toString()),
    body("to").exists().trim().isDate().isAfter((new Date()).toString()).custom((sd, { req }) => {
        const from: Date = new Date(req.query?.from ?? null);
        const to: Date = new Date(sd);
        if (to <= from) {
            throw new Error('End date must be greater than start date');
        }
        return true;
    }),
    body("places").exists().isInt({ gt: 0 }),
    body("reservationId").exists().isInt({ gt: 0 }),
];



@Route("reservation")
export class ControllerReservation {
    @Get("make")
    public async make(req: reservationMakeRequest): Promise<reservationMakeResponse | false> {
        const manager = AppDataSource.manager;
        try {

            const room: Room = await manager.getRepository(Room).createQueryBuilder('room')
                .where("id = :id", { id: req.roomId })
                .andWhere("isActive = 1")
                .andWhere("places >= :places", { places: req.places })
                .andWhere(db => `NOT EXISTS ${db.subQuery()
                    .select('1')
                    .from(Reservation, 'reservations')
                    .where("roomId = :id", { id: req.roomId })
                    .andWhere(new Brackets((qb) => {
                        qb.where('fromDate BETWEEN DATE(:from) AND DATE(:to)', { from: req.from.toISOString(), to: req.to.toISOString() })
                            .orWhere('toDate BETWEEN DATE(:from) AND DATE(:to)', { from: req.from.toISOString(), to: req.to.toISOString() })
                    })
                    )
                    .andWhere('status NOT IN (:...status)', { status: ['CANCELLED', 'CREATED'] })
                    .getQuery()}`)
                .cache(false)
                .getOneOrFail();

            if (room) {
                const reservation = new Reservation();
                reservation.fromDate = req.from;
                reservation.toDate = req.to;
                reservation.room = room;
                reservation.places = req.places;
                reservation.user = req.user;
                await manager.save(reservation);
                return { result: reservation };
            }
        } catch (err) { 
            console.log(err);
        }
        return false;
    }

    @Get("change")
    public async change(req: reservationChangeRequest): Promise<reservationChangeResponse | false> {
        const manager = AppDataSource.manager;
        try {
            const reservation: Reservation = await manager.createQueryBuilder(Reservation, 'reservation1')
                .innerJoin('reservation1.room', 'room')
                .where("reservation1.id = :id", { id: req.reservationId })
                .andWhere("status = 'CREATED'")
                .andWhere("room.places >= :places", { places: req.places })
                .andWhere(db => `NOT EXISTS ${db.subQuery()
                    .select('1')
                    .from(Reservation, 'reservation2')
                    .where("reservation2.id != :id", { id: req.reservationId })
                    .andWhere("roomId = reservation1.roomId")
                    .andWhere(new Brackets((qb) => {
                        qb.where('fromDate BETWEEN DATE(:from) AND DATE(:to)', { from: req.from.toISOString(), to: req.to.toISOString() })
                            .orWhere('toDate BETWEEN DATE(:from) AND DATE(:to)', { from: req.from.toISOString(), to: req.to.toISOString() })
                    })
                    )
                    .andWhere('status NOT IN (:...status)', { status: ['CANCELLED', 'CREATED'] })
                    .getQuery()}`)
                .cache(false)
                .getOneOrFail();

            if (reservation) {
                reservation.fromDate = req.from;
                reservation.toDate = req.to;
                reservation.places = req.places;
                await manager.save(reservation);
                return { result: reservation };
            }
        } catch (err) { 
            console.log(err);
        }
        return false;
    }

}