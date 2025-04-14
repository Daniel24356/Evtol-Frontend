import { loginDTO } from "../dto/login.dto";


export interface AuthService {
    login(data: loginDTO): Promise<{accessToken:string; refreshToken: string}>
}