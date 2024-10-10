import { IUser } from "../../interfaces/user.interface";
import { OTPDocument } from "../../models/otp.model";
import Joi from "joi";

export type VerifyUserDTO = Partial<IUser> & Partial<OTPDocument>;

export const validateVerifyUser = (userVerify: VerifyUserDTO) => {
    const JoiSchema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email(),
        phonenumber: Joi.string(),
        country: Joi.string(),
        sportsInterest: Joi.string(),
        otp: Joi.string().length(8).required(),  // Assuming OTP is 8 digits based on your OTP generation
    });

    return JoiSchema.validate(userVerify);
};