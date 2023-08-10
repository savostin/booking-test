import { AppDataSource } from "./index"

import { User, randomKey } from "../models/user";
import { Hotel } from "../models/hotel";
import { Room } from "../models/room";
import { EntityManager } from "typeorm";
import { Reservation, ReservaionStatus } from "../models/reservation";

const demoParams = {
    hotels: {
        count: 10,
        names: {
            first: ['Awesome', 'Beautiful', 'Pretty', 'Sunny', 'Lovely', 'Gorgeous', 'Exclusive', 'Charming'],
            middle: ['Peaceful', 'Private', 'City', 'Central', 'Wonderful', 'Superb', 'Great', 'Magic', 'Cool'],
            last: ['Paradise', 'Heaven', 'Beach', 'Land', 'Coast', 'Sand', 'Breeze', 'Relax', 'Weekend', 'Break'],
        }
    },
    rooms: {
        min: 3,
        max: 10
    },
    users: 10,
    constKey: 'd4d507545d2e0be371bdea707c814c830c6f54baf3bef716e2f9e90a2bd67e4a',
    names: {
        first: ['John', 'Mike', 'Tim', 'Emma', 'Andrew', 'Eleonora', 'Jack', 'Thomas', 'Amelia', 'Noah', 'George', 'Jacob', 'Olivia'],
        last: ['Doe', 'Smith', 'Williams', 'Allen', 'Martin', 'Cooper', 'Anderson', 'Lee', 'Carter', 'Adams', 'Hughes', 'Hill', 'Campbell']
    },
    streets: {
        first: ['High', 'Station', 'Main', 'Park', 'Church', 'London Road', 'Victoria', 'School', 'South', 'King', 'York', 'West'],
        second: ['Street', 'Road', 'Avenue', 'Close', 'Lane', 'Way'],
    },
    cities: ['London', 'Bath', 'Cambridge', 'Doncaster', 'Lancaster', 'Liverpool', 'Manchester', 'Oxford', 'Southampton', 'Sunderland', 'Winchester', 'Leeds', 'Kingston-upon-Hull', 'Chichester', 'Bristol', 'Brighton & Hove', 'Peterborough'],
}

const range = (start: number, end: number): number[] => Array.from({ length: (end - start) }, (v, k) => k + start);
const getRandomElement = (arr: any[]) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChar = (): string => String.fromCharCode(randomInt(65, 90));
const postcode = (): string => `${randomChar()}${randomInt(1, 99)} ${randomChar()}${randomChar()}${randomChar()}`;


const InitDemoData = async () => {
    const manager: EntityManager = AppDataSource.manager;
    await manager.clear(Reservation);
    await manager.clear(Room);
    await manager.clear(Hotel);

    range(0, demoParams.hotels.count).forEach(async (hi: number) => {
        const hotel = new Hotel();
        hotel.name = `${getRandomElement(demoParams.hotels.names.first)} ${getRandomElement(demoParams.hotels.names.middle)} ${getRandomElement(demoParams.hotels.names.last)}`;
        hotel.address = `${randomInt(1, 1000)}, ${getRandomElement(demoParams.streets.first)} ${getRandomElement(demoParams.streets.second)}, ${getRandomElement(demoParams.cities)}, UK`;
        hotel.postcode = postcode();
        hotel.rooms = [];
        range(demoParams.rooms.min, demoParams.rooms.max).forEach(async (ri: number) => {
            const room = new Room();
            room.hotel = hotel;
            room.name = `${100 + ri}`;
            room.isActive = Math.random() < 0.95;
            room.places = randomInt(1, 5);
            room.price = 100 * randomInt(1, 100);
            hotel.rooms.push(room);
            await manager.save(room);
        })
        await manager.save(hotel);
    });

    await manager.clear(User);
    range(0, demoParams.users).forEach(async (ui: number) => {
        const user = new User();
        user.firstName = getRandomElement(demoParams.names.first);
        user.lastName = getRandomElement(demoParams.names.last);
        user.isActive = Math.random() < 0.95;
        user.authKey = ui === 0 ? demoParams.constKey : randomKey();
        await manager.save(user);
    });

    range(0, 10).forEach(async (i: number) => {
        const room = await manager.createQueryBuilder(Room, 'room')
            .orderBy('RANDOM()')
            .getOneOrFail();
        const user = await manager.createQueryBuilder(User, 'user')
            .orderBy('RANDOM()')
            .getOneOrFail();
        const days = randomInt(1, 30);
        const skip = randomInt(1, 30);
        const from = new Date();
        from.setDate(from.getDate() + skip);
        const to = new Date();
        to.setDate(to.getDate() + skip + days);
        const reservation = new Reservation();
        reservation.fromDate = from;
        reservation.toDate = to;
        reservation.room = room;
        reservation.user = user;
        reservation.status = getRandomElement(Object.keys(ReservaionStatus));
        await manager.save(reservation);
    });


}

export { InitDemoData };