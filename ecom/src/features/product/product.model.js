import UserModel from "../user/user.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js"
export default class ProductModel{
  constructor( name, desc, price, imageUrl, category, sizes,id){
     
      this.name = name;
      this.desc = desc;
      this.price = price;
      this.imageUrl = imageUrl;
      this.category = category;
      this.sizes = sizes;
      this._id = id;
  }
  
  static add(product){
    product.id = products.length + 1;
    products.push(product);
    return product;
  }

  static get(id){
    const product = products.find((i)=>i.id ==id);
    return product;

  }

  static GetAll(){
      return products;
  }

  static filter(minPrice, maxPrice, category){
   
    const result = products.filter((product)=>{
      return(
      (!minPrice || 
        product.price >= minPrice) &&
      (!maxPrice || 
        product.price <= maxPrice) &&
      (!category || 
        product.category == category)
      );
    });
    return result;
  }
   static rateProduct(userID,productID,rating){
    //1.validate user and product
    console.log("product model for rating hit's")
    console.log(products);
    const user=UserModel.getAll().find((u)=>{
      return u.id==userID;
    })
    if(!user){
      throw new ApplicationError("User not found", 404); 
    }
    console.log(productID)
   const product= products.find((p)=>{
     return p.id==productID;
    })
//validate product
    if(!product){
      throw new ApplicationError("Product not found", 400); 
    }
//2.check if no ratings then afflu the ratings
if(!product.ratings){
  product.ratings=[];
  product.ratings.push({userID:userID,rating:rating});
}else{
  //check if user ratings is already avlaible
  const existingRatingIndex=product.ratings.findIndex((r)=>{
    return r.userID ==userID;
  });

 if(existingRatingIndex>=0){
  product.ratings[existingRatingIndex]={
    userID:userID,
    rating:rating,
  }}else{
     //if no exsisting rating then add the new ratings
    if(!product.ratings){
      products.ratings.push({userID:userID,rating:rating});
  }
}

 } 
  }

//In this aproach there might be possiblity of race condiction 
//   static rateProduct(userID,productID,rating){
//     //1.validate user and product
//     console.log("product model for rating hit's")
//     console.log(products);
//     const user=UserModel.getAll().find((u)=>{
//       return u.id==userID;
//     })
//     if(!user){
//       throw new ApplicationError("User not found", 404); 
//     }
//     console.log(productID)
//    const product= products.find((p)=>{
//      return p.id==productID;
//     })
// //validate product
//     if(!product){
//       throw new ApplicationError("Product not found", 400); 
//     }
// //2.check if no ratings then afflu the ratings
// if(!product.ratings){
//   product.ratings=[];
//   product.ratings.push({userID:userID,rating:rating});
// }else{
//   //check if user ratings is already avlaible
//   const existingRatingIndex=product.ratings.findIndex((r)=>{
//     return r.userID ==userID;
//   });

//  if(existingRatingIndex>=0){
//   product.ratings[existingRatingIndex]={
//     userID:userID,
//     rating:rating,
//   }}else{
//      //if no exsisting rating then add the new ratings
//     if(!product.ratings){
//       products.ratings.push({userID:userID,rating:rating});
//   }
// }

//  } 
//   }
}

var products = [
  new ProductModel(
    1,
    'Product 1',
    'Description for Product 1',
    19.99,
    'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
    'Cateogory1'
  ),
  new ProductModel(
    2,
    'Product 2',
    'Description for Product 2',
    29.99,
    'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
    'Cateogory2',
    ['M', 'XL']
  ),
  new ProductModel(
    3,
    'Product 3',
    'Description for Product 3',
    39.99,
    'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
    'Cateogory3',
    ['M', 'XL','S']
  )];