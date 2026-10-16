import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import { sendEmail } from "../../../lib/email/nodemailer.js";
import { toMs } from "../../../pkg/utils/time.js";
import { generateOTPCode } from "../../../lib/utilits.js/otp.js";
import { otpExpired, invalidCode, invalidPassword } from "../error.js";
import { userAlreadyExistError, userAlreadyVerified, userNotVerified, userNotExist } from "../../user/errors.js";
import { generateToken } from "../utils/token.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import {verifyGoogleToken} from '../utils/goolge-auth.js';
import { mailjetProvider } from "../../../lib/email/init.js";



export async function register(userData) {
    const userExists = await authRepository.checkUserExistByEmail(userData.email);
    if (userExists) {
        const error = userAlreadyExistError;
        error.statusCode = 409;
        throw error;
    }
    userData.password = await hashPassword(userData.password);
    const createdUser = await authRepository.createUser(userData);
    const otp = generateOTPCode();

    await otpRepository.createOtp({
        code: otp,
        email: userData.email,
        expiresAt: Date.now() + toMs(5, "minutes")

    });

    await mailjetProvider.sendMail(userData.email, 'Verification Code', `<p>your Verification Code is: ${otp}</p>`);

    return createdUser;
}
export async function verifyAccount(email, code) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) {
        throw userNotExist;
    };
    if (user.isverified === true) {
        throw userAlreadyVerified;
    }
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) {
        throw otpExpired;
    }
    if (otp.code !== code) {
        throw invalidCode;
    }
    const updatedUser = await userRepository.updateUserByEmail(email, { isverified: true });
    await otpRepository.deleteOTPsByEmail(email);
    return updatedUser;
}
export async function login(email, password) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) {
        throw userNotExist;
    }
    if (user.isverified !== true) {
        throw userNotVerified;
    }
    const match = await comparePassword(password, user['password']);
    if (!match) {
        throw invalidPassword;
    }
    return generateToken({ id: user._id, name: user.name });
}
export async function sendOtp(email) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) {
        throw userNotExist;
    }
    await otpRepository.deleteOTPsByEmail(email);
    const code = generateOTPCode();
    await otpRepository.createOtp({
        code: code,
        email: email,
        expiresAt: Date.now() + toMs(5, "minutes")
    });
    await mailjetProvider.sendMail(email, 'new otp', `<p>your new otp is: ${code}</p>`);
}
export async function resetPassword(email, code, newPassword) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) {
        throw userNotExist;
    }

    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) {
        throw otpExpired;
    }
    if (otp.code !== code) {
        throw invalidCode;
    }

    const hashedPassword = await hashPassword(newPassword);
    await userRepository.updateUserByEmail(email, { password: hashedPassword });
    await otpRepository.deleteOTPsByEmail(email);
}

export async function LoginWithGoogle(idToken) {
    const payload = await verifyGoogleToken(idToken);
    const user = await authRepository.checkUserExistByEmail(payload.email);
    if (user) {
   return generateToken({ id: user._id, email: user.email });
    }
    const createdUser = await authRepository.createUser({
        email: payload.email,
        name: payload.name,
        provider: "google",
        isverified: true,
    });
  return generateToken({ id: createdUser._id
    , email: createdUser.email });

 }