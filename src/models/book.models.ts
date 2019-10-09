import { Book } from "src/entities";

export interface BookResponseModel {
    success: boolean
    message?: string
    data?: Book
}

export interface BookRequestModel {
    body?: Book 
    params?:{
        id:string
    }
}

export interface DeleteBookModel {
    body: string[] 
}