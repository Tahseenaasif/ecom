import express from "express";
import orderController from "./order.controller.js";
 const ordercontroller=new orderController();
const orderRouter=express.Router();

orderRouter.post("/",(req,res,next)=>{
    ordercontroller.placeorder(req,res,next);
})


export default orderRouter;



