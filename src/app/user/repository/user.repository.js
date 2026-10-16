import { User } from "../model/user.model.js";

 export async function updateUserByEmail(email, updateData) {
    return  User.findOneAndUpdate(
        { email: email },
         updateData,
          { returnDocument: 'after' });
 }
export async function findUserById(id) {
 
return User.findOne({_id: id, isdeleted: false}, {password: 0}, {});




}




