import { Book } from "src/entities";

export interface BookResponseModel {
    success: boolean
    message?: string
    data?: Book
}