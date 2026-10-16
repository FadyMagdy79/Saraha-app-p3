
import argon2  from "argon2";

export  async function hashPassword(password) {
    return argon2.hash(password);
}

export async function comparePassword(password, hashPassword) {
    return argon2.verify(hashPassword,password );
}