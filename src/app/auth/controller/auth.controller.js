 
 import * as authService from "../service/auth.service.js";
 import { toMs } from "../../../pkg/utils/time.js";
import { validate } from "zod";
import { validateBody } from "../../../lib/validation/validation.js";
import { registerDTO } from "../dto/auth.dto.js";
import { verifyAccountDTO } from "../dto/auth.dto.js";
import { loginDTO } from "../dto/auth.dto.js";
import { sendotpDTO } from "../dto/auth.dto.js";
import { resetPasswordDTO } from "../dto/auth.dto.js";


 export async function register(req, res , next) {
    try {
        const date = validateBody(registerDTO, req.body);
        const createdUser = await authService.register(date);
        res.status(201).json({ message: "User registered successfully",
             success: true,
              data: createdUser });
    } catch (error) {
        next(error);
    }
 }
 export async function verifyAccount(req, res, next) {
    try {

         const date = validateBody(verifyAccountDTO, req.body);
              const { email, code } = date;
        const updatedUser = await authService.verifyAccount(email, code);
        res.status(200).json({ message: "Account verified successfully", success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
}
export async function login(req, res, next) {
    try {
        const date =validateBody(loginDTO, req.body);
        const { email, password } = date;
        const token = await authService.login(email, password);
        res.cookie("access_token", token, { httpOnly: true, maxAge: toMs(1, "hours") });
        res.status(200).json({ message: "Login successful", success: true, token: token });
    } catch (error) {
        next(error);
    }
}
export async function sendOtp(req, res, next) {
    try {
        const date = validateBody(sendotpDTO, req.body);
        const { email } = date;
        await authService.sendOtp(email);
        res.status(200).json({ message: "new otp sent ,  check your email", success: true });
    } catch (error) {
        next(error);
    }
}
export async function resetPassword(req, res, next) {
    try {
        const date = validateBody(resetPasswordDTO, req.body);
        const { email, code, newPassword } = date;
        await authService.resetPassword(email, code, newPassword);
        res.json
        ({ message: "Password reset successful",
             success: true 
            });
    } catch (error) {
        next(error);
    }
}
export async function LoginWithGoogle(req,res,next) {
    try {
       
        const token = await authService.LoginWithGoogle( req.body.idToken);

        res.cookie("access_token", token, { httpOnly: true, maxAge: toMs(2
            , "hours") });
        res.json({ message: " User Login successful", success: true});
    } catch (error) {
        next(error);
    }
    
}