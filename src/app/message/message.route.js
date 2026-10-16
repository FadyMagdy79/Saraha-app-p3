import {Router} from "express";
import * as messageController from './controller/message.controller.js';
import {AuthGuard} from "../../lib/auth/AuthGuard.js";

const messageRouter = Router();
messageRouter.post('/', messageController.sendMessage);
messageRouter.post('/public', AuthGuard, messageController.sendMessage);
messageRouter.get('/', AuthGuard, messageController.getAllMessages);
export default messageRouter;