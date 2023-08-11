import { User } from "../../models/user";
import { AppDataSource } from "../../database";


export default class AuthController {
    public async getUserByKey(key: string): Promise<User | false> {
        const userRepository = AppDataSource.getRepository(User);
        try {
            return await userRepository.findOneByOrFail({ authKey: key });
        } catch (err) {
            console.log(err);
        }
        return false;
    }
}