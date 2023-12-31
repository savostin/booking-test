import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Index,
    AfterLoad,
    AfterInsert,
    AfterUpdate
} from "typeorm"
import { IsOptional } from 'class-validator';

import { Room } from "../room";
import { User } from "../user";

export enum ReservaionStatus {
    CREATED = 'CREATED',
    PAID = 'PAID',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    FULFILLED = 'FULFILLED'
}

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn({
        unsigned: true,
    })
    id: number

    @Column({
        nullable: false,
        enum: ReservaionStatus,
        default: ReservaionStatus.CREATED
    })
    @Index()
    status: ReservaionStatus

    @Column({
        nullable: false,
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    @Index()
    created: Date

    @ManyToOne(() => User, (user) => user.reservations)
    @JoinColumn()
    user: User

    @ManyToOne(() => Room, (room) => room.reservations)
    @JoinColumn()
    room: Room

    @Column({
        nullable: false,
        type: 'date',
    })
    @Index()
    fromDate: Date

    @Column({
        nullable: false,
        type: 'date',
    })
    @Index()
    toDate: Date

    @Column({
        unsigned: true,
        nullable: false,
        type: 'int',
    })
    places: number

/* Nice to have a virtual column with number of nights: 
    @IsOptional()
    nights: number;

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    generateNights(): void {
        this.nights = Math.floor((this.toDate.getTime() - this.fromDate.getTime()) / (1000 * 3600 * 24));
    }
*/
}