 
 import { uploadProfilePic as saveProfilePic } from "../service/user.service.js";
 export const uploadProfilePic = async (req, res, next) => {
   try {
    await saveProfilePic(req.user.id, req.file);
     res.json({message: "upload profile successfully.", success: true});
 } catch (error) {
    next(error);
}
}