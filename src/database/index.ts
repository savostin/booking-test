import "reflect-metadata";
import { DataSource, Brackets } from "typeorm"
import { User } from "../models/user"
import { Hotel } from "../models/hotel"
import { Room } from "../models/room"
import { Reservation } from "../models/reservation"


const AppDataSource:DataSource = new DataSource({
    type: "sqlite",
    database: process.env.DB_DATABASE || "memory:",
    synchronize: true,
    entities: [User, Room, Hotel, Reservation],
    logging: ["error"]
})

export { AppDataSource, Brackets };