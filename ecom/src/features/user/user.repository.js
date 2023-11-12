import mongoose from "mongoose";
import {userSchema} from "./user.schema.js"
import { ApplicationError } from "../../error-handler/applicationError.js";
//creating model for the schema
const UserModel = mongoose.model('User', userSchema)
export default class UserRepository{
   
    async signUp(user){
        try{
            // create instance of model.
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        }
        catch(err){
            console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
                console.log(err);
                throw new ApplicationError("Something went wrong with database", 500);
            }
            
        }
    }
    

        async  findByEmail(email){
            try{
           return  await UserModel.findOne({email});
            // return newUser;
            }catch(err){
                throw new ApplicationError("something went wrong",500);
            }
        }

        async resetPassword(userID, hashedPassword){
            try{
                let user = await UserModel.findById(userID);
                if(user){
                    user.password=hashedPassword;
                    user.save();
                }else{
                    throw new Error("No such user found");
                }
                
            } catch(err){
                console.log(err);
                throw new ApplicationError("Something went wrong with database", 500);
            }
        }
    
}


   
