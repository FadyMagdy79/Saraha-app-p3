

import fs from "fs";
import * as userRepository  from "../repository/user.repository.js";
import { userNotExist } from "../errors.js";

export const uploadProfilePic =  async(userId,file)=>{
     const user = await userRepository.findUserById(userId);
    if (!user) throw userNotExist;
    
    if (user.profilePicPath) {
        fs.unlinkSync(user.profilePicPath);
    }
    // update new image
    await userRepository.updateUserByEmail(user.email, {profilePicPath: file.path});
}