import { IUser } from '../../interfaces/user.interface';
const Joi = require("joi");

export type UserDTO = Partial<Pick<IUser, "phonenumber" | "email">>


export const validateUser = (user: UserDTO) => {
    const JoiSchema = Joi.object({
        phonenumber: Joi.string().min(10).max(15),
        email: Joi.string().email(),
    })
        .xor('phonenumber', 'email')  // Ensures that either phone number or email is present, but not both
        .or('phonenumber', 'email')   // Ensures that at least one of phone number or email is present
        .options({ abortEarly: false });  // Allows showing all validation errors, not just the first one

    return JoiSchema.validate(user);
}