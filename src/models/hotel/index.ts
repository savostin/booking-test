import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    Index,
    JoinColumn
} from "typeorm"

import { Room } from "../room";

export enum HotelFacilities {
    FREE_WIFI = "Free Wi-Fi",
    PARKING = "Parking",
    PETS = "Pets",
}


@Entity()
export class Hotel {
    @PrimaryGeneratedColumn({
        type: 'int',
        unsigned: true,
    })
    id: number

    @Column({
        nullable: false,
        length: 32,
    })
    @Index()
    name: string

    @Column({
        nullable: false,
        length: 132,
    })
    address: string

    @Column({
        nullable: false,
        length: 7,
    })
    @Index()
    postcode: string

/** SET datatype is not supported by SQLite: 
    @Column({
        nullable: true,
        enum: HotelFacilities,
    })
    @Index()
    facilities: HotelFacilities[]
*/


    @OneToMany(() => Room, (room: Room) => room.hotel)
    @JoinColumn()
    rooms: Room[]

}