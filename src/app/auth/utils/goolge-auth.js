import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../../../lib/error/error.js';
import { env } from '../../../lib/config/env.js';



 const client = new OAuth2Client();
export async function verifyGoogleToken(idToken) {
    try {
       
        const ticket = await client.verifyIdToken({ 
            idToken: idToken,
             audience:[env.google.webClientId,env.google.iosClientId]});
        return ticket.getPayload();

    } catch (error) {
        throw new AppError('invalid token', 403);
    }

}