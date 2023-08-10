import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm"
import { Reservation } from "../reservation";
import * as crypto from 'crypto';


const randomKey = () => (crypto.randomBytes(32)).toString('hex');

@Entity()
class User {
    @PrimaryGeneratedColumn({
        type: 'int',
        unsigned: true,
    })
    id: number

    @Column({
        nullable: false,
        length: 32,
    })
    firstName: string

    @Column({
        nullable: false,
        length: 32,
    })
    lastName: string

    @Column({
        nullable: false,
        length: 32,
        unique: true,
    })
    authKey: string

    @Column({
        nullable: false,
        default: false
    })
    isActive: boolean

    @OneToMany(() => Reservation, (reservation: Reservation) => reservation.room)
    @JoinColumn()
    reservations: Reservation[]

}

export { User, randomKey };
