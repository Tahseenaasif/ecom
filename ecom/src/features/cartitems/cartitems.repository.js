import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js"
import CartItemModel from "./cartItems.model.js"
import {ApplicationError} from "../../error-handler/applicationError.js"
export default class CartitemsRepository{
    constructor(){
        this.cartitemsRepository="cartItems";
    }
    async add(productID, userID, quantity){
        try{
            const db=getDB();
            const collection=db.collection(this.cartitemsRepository);
            const id = await this.getNextCounter(db);
            console.log("this is the counter id:",id)
             await collection.updateOne(
              {
               productID:new ObjectId(productID),
               userID:new ObjectId(userID)
              },
              {
                $setOnInsert: {_id:id},
                $inc:{quantity: quantity}
              },
              {
               upsert:true
              }
             );
           //  return cartitem;
        }catch(err){
            throw new ApplicationError("Something went wrong with database", 500);
        }
       
       
    }
    async get(userID){
       try{
        const db=getDB();
        const collection=db.collection(this.cartitemsRepository);
        return await collection.find({
            userID:new ObjectId(userID)}).toArray();
        

       }catch(err){
       
         throw new ApplicationError("Something went wrong with database", 500);
       }
    }

    async delete(cartItemID,userID) {
        try {
            const db=getDB();
            const collection=db.collection(this.cartitemsRepository);
           const result=await collection.deleteOne(
            {
               _id:new ObjectId(cartItemID),
               userID:new ObjectId(userID)
            });
        return result.deletedCount>0;      
        } catch (err) {
          // Handle the error appropriately; you can throw an error or log it
          throw new Error("Something went wrong with the database");
        }
      }
      
      async getNextCounter(db){

        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {
                _id:'cartItemId'
            },

            {
                $inc:{value: 1}
            },
            
            {
                returnDocument:'after'
            }
        )  
        console.log(resultDocument);
        return resultDocument.value;
    }

}