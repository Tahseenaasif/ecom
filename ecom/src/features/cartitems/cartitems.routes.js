import express from 'express';

import CartItemsController from "./cartitems.controllers.js"


const cartRouter = express.Router();
const CartItemsControllerr = new CartItemsController();

cartRouter.delete("/:id",
(req,res)=>{
CartItemsControllerr.delete(req,res)
})

cartRouter.post("/",(req,res)=>{
    CartItemsControllerr.add(req,res)
});

cartRouter.get("/",
       (req,res)=>{
       CartItemsControllerr.get(req,res)
})


export default cartRouter;