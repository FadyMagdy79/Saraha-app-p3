import jwt from "jsonwebtoken";
import {env} from "../config/env.js";
import { AppError } from "../../lib/error/error.js";

export function AuthGuard(req, res, next) {
    try {
       
        const token = req.cookies.access_token;
        if (!token) throw new AppError('no token provided', 403);
        const decoded = jwt.verify(token, env.jwt.secret);
        req.user = decoded.payload ?? decoded;
        
        next();
    } catch (error) {
        next(error);
    }
}