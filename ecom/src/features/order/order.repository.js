import { ObjectId } from "mongodb";
import {getDB} from "../../config/mongodb.js"
import { ApplicationError } from "../../error-handler/applicationError.js";
import orderModel from "./order.model.js";
import {getClient} from "../../config/mongodb.js"
export default class orderRepository{
    constructor(){
        this.collection="orders";
    }

    async placeOrder(userId){
        const client = getClient();
        const session = client.startSession();
        try{
        
        const db = getDB();
        session.startTransaction();
        // 1. Get cartitems and calculate total amount.
        const items = await this.getTotalAmount(userId, session);
        const finalTotalAmount = items.reduce((acc, item)=>acc+item.totalAmount, 0)
        console.log(finalTotalAmount);
        
        // 2. Create an order record.
        const newOrder = new orderModel(new ObjectId(userId), finalTotalAmount, new Date());
        await db.collection(this.collection).insertOne(newOrder, {session});
        
        // 3. Reduce the stock.
        for(let item of items){
            await db.collection("products").updateOne(
                {_id: item.productID},
                {$inc:{stock: -item.quantity}},{session}
            )
        }
        // throw new Error("Something is wrong in placeOrder");
        // 4. Clear the cart items.
        await db.collection("cartItems").deleteMany({
            userID: new ObjectId(userId)
        },{session});
        session.commitTransaction();
        session.endSession();
        return;
        }catch(err){
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }

        
       
        
        //4.clear the cart item  
        
        async getTotalAmount(userId, session){
            const db = getDB();
            const items = await db.collection("cartItems").aggregate([
                // 1. Get cart items for the user
                {
                    $match:{userID: new ObjectId(userId)}
                },
                // 2. Get the products form products collection.
                {
                    $lookup:{
                        from:"products",
                        localField:"productID",
                        foreignField:"_id",
                        as:"productInfo"
                    }
                },
                // 3. Unwind the productinfo.
                {
                    $unwind:"$productInfo"
                },
                // 4. Calculate totalAmount for each cartitems.
                {
                    $addFields:{
                        "totalAmount":{
                            $multiply:["$productInfo.price", "$quantity"]
                        }
                    }
                }
            ], {session}).toArray();
            return items;
        }
    // async getTotalAmount(userId,session) {
    //     try{

    //         console.log("this is the userId",userId);
    //         const db = getDB();
    //         const items = await db.collection("cartItems").aggregate([
    //           // 1. Get cart items for the user
    //           {
    //             $match: { userID: new ObjectId(userId) }
    //           },
    //           // 2. Get the product from the product collection
    //           {
    //             $lookup: {
    //               from: "products",
    //               localField: "productID",
    //               foreignField: "_id",
    //               as: "productInfo"
    //             }
    //           },
    //           // Unwind the productInfo array
    //           {
    //             $unwind: "$productInfo"
    //           },
    //           // Calculate the total amount for each cart item
    //           {
    //             $addFields: {
    //               "totalAmount": {
    //                 $multiply: ["$productInfo.price", "$quantity"]
    //               }
    //             }
    //           }
    //         ],{session}).toArray();
    //         return items;
           
    //       }catch(err){
    //         throw new ApplicationError("Something went wrong with database", 500);
    //          }

    //     }

}

       
      


