import orderRepository from "./order.repository.js";

export default class orderController{
    constructor(){
        this.orderRepository=new orderRepository();
    }

    async placeorder(req,res,next){
        try{
         const userId=req.userID;
         console.log("userid",userId);
         await this.orderRepository.placeOrder(userId);
         res.status(201).send("order is created");
        }catch(err){
           console.log(err);
           next(err)
        }
    }
}