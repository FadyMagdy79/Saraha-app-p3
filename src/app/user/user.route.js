import { Router } from "express";
import { withCache } from "../../pkg/cashe/withCashe.js";
import {User}from "./model/user.model.js";
import { UploadSingleFile, UploadFilesArray } from "../../lib/media/multer.js";
import { allowedFields } from "../../lib/media/file.validation.js";
import { fileValidation } from "../../lib/media/file.validation.js";
import { AuthGuard } from "../../lib/auth/AuthGuard.js";
import * as userController  from "./controller/user.controller.js";
const userRouter = Router();
userRouter.get('/get-all-users',
    withCache(),
    async (req, res, next) => {
    const data =await User.find();
    res.json(data);
}

)
userRouter.post('/upload-profile-pic'
    ,AuthGuard,
     UploadSingleFile('pp'),
    fileValidation(),
    userController.uploadProfilePic,
 );

userRouter.post('/upload-cv', UploadSingleFile('cv',['application/pdf','application/msword']),
fileValidation(),
 (req, res, next) => {
   
   
});

userRouter.post('/upload-cover-images', UploadFilesArray('cover-images',3), (req, res, next) => {
     console.log(req.files);
    res.json('ok');
});
export default userRouter;