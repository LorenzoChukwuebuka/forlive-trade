import mongoose from "mongoose"
import { UserStatus } from "./enums/user.enums"

export type IUser = {
    id:mongoose.Types.ObjectId
    firstname: string
    lastname: string
    email: string
    phonenumber: string
    username: string
    password: string
    country: string
    sportsInterest: string
    status: UserStatus
    emailVerified: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}