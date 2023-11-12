import { ApplicationError } from "../../error-handler/applicationError.js";
import {getDB} from "../../config/mongodb.js";
export default class UserRepository{
    constructor(){
        this.collection="users";
    }
   async  signUp(newUser){
        try{
      //1.Get the database
       const db=getDB();
       //2.get the collection
       const collection = db.collection(this.collection);
       //remove this hard code from the function and inilise it in the constructor
        //3.Insert the document.
        await collection.insertOne(newUser);
         return newUser;
        }catch(err){
            throw new ApplicationError("something went wrong",500);
        }
    }

    async  findByEmail(email){
        try{
      //1.Get the database
       const db=getDB();
       //2.get the collection
      const collection = db.collection(this.collection);
        //3.Insert the document.
       return  await collection.findOne({email});
        // return newUser;
        }catch(err){
            throw new ApplicationError("something went wrong",500);
        }
    }

}