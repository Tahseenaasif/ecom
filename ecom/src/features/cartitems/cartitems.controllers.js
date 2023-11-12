import CartItemModel from "./cartItems.model.js";
import CartitemsRepository from "./cartitems.repository.js"
export default class CartItemsController {
    constructor(){
        this.cartitemsRepository=new CartitemsRepository();
    }
   async  add(req, res) {
    try{
        console.log("this is the req body",req.body);
        const { productID, quantity} = req.body;
        const userID = req.userID;
        await this.cartitemsRepository.add(productID, userID, quantity);
        res.status(201).send("Cart is updated");

    }catch(err){
        return res.status(500).send(err.message);
    }
 }

   async get(req, res){
      try{
        const userID = req.userID;
        console.log("this is userid",userID);
        const items =await this.cartitemsRepository.get(userID);
        return res.status(200).send(items);  

      }catch(err){
        return res.status(500).send(err.message);
      }  
    }

    async delete(req, res) {
      //const userID = req.userID;
      const cartItemID = req.params.id;
      const userID=req.userID;
      try {
        const isdeleted = await this.cartitemsRepository.delete(cartItemID,userID);
    
        if (!isdeleted) {
          return res.status(404).send("No item to delete");
        }
    
        return res.status(200).send("Cart item is removed");
      } catch (error) {
        return res.status(500).send("Internal server error");
      }
    }


    
}