export default class CartItemModel{
    constructor(productID,userID,quantity,id){
       this.productID=productID;
       this.userID=userID;
       this.quantity=quantity;
       this._id=id;
    }
   static  add(productID,userID,quantity){
      const cartitem=new CartItemModel(
        productID,
        userID,
        quantity,
      )
      cartitem.id=cartitems.length;
      cartitems.push(cartitem);
    }

    static get(userID){
    const cartitem = cartitems.filter((item) => item.userID === userID);

     console.log(cartitem);
     return cartitem;
    }

    static delete(cartItemID,userID){
      const cartitemIndex = cartitems.findIndex(i=>i.id==cartItemID && i.userID==userID
        );

      if(cartitemIndex==-1){
        return('item not found')
      }else{
       cartitemIndex.splice(cartitemIndex,1);
      }



    }
   


  }
 
  
  let cartitems=[
      
      new CartItemModel(1,1,3,1),
      new CartItemModel(1,2,3,1)
  ]