import { User } from "src/entities";

export interface UserResponseModel {
    success: boolean
    message?: string
    errorValid?: boolean
    data?: User|{}
}