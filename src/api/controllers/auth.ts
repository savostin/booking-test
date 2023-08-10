import { User } from "../../models/user";
import { AppDataSource } from "../../database";


export default class AuthController {
    public async getUserByKey(key: string): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
            return await userRepository.findOneByOrFail({ authKey: key });
    }
}