import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from "typeorm"
import { Hotel } from "../hotel";
import { Reservation } from "../reservation";


export enum RoomFacilities {
    COFFE_MACHINE = "Coffe Machine",
    SAFE = "Safe",
    TV = "TV",
    IRON = "Iron",
    WASHING_MACHINE = "Washing machine",
    MICROWAVE = "Microwave",
    BATH = "Bath"
}

@Entity()
export class Room {
    @PrimaryGeneratedColumn({
        type: 'int',
        unsigned: true,
    })
    id: number

    @Column({
        nullable: false,
        length: 10
    })
    name: string

    @Column({
        nullable: false,
        unsigned: true,
        type: 'int',
        default: 1
    })
    @Index()
    places: number

    @Column({
        nullable: false,
        unsigned: true,
        type: 'int'
    })
    @Index()
    price: number


/** SET datatype is not supported by SQLite: 
    @Column({
        nullable: true,
        enum: RoomFacilities,
    })
    @Index()
    facilities: RoomFacilities[]
*/

    @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
    @JoinColumn()
    hotel: Hotel

    @Column({
        nullable: false,
        default: false
    })
    isActive: boolean

    @OneToMany(() => Reservation, (reservation: Reservation) => reservation.room)
    @JoinColumn()
    reservations: Reservation[]

}