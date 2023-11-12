import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import {productSchema} from "./product.schema.js"
import {reviewSchema} from "./review.schema.js"
import {categorySchema} from "./category.schema.js"
const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const categoryModel=mongoose.model("Category",categorySchema)

class PorductRepository{
    constructor(){
        this.collection="products";
    }
    async add(productData){
        try{
            //1.add the product
            productData.categories=productData.category.split(',');
            console.log(productData.categories);
         const newProduct=new ProductModel(productData);
         const savedProduct=await newProduct.save();
         //2.update the categories
         await categoryModel.updateMany(
            {
              _id:{$in:productData.categories}
            },
            {
               $push:{products:new ObjectId(savedProduct._id)}
            }
            )
            return savedProduct;
        }catch(err){
            throw new ApplicationError("something went wrong with the database",500);
        }
    }
//  async add(newProduct){
//     try{
//         //1.Get the database
//          const db=getDB();
//          //2.get the collection
//          const collection = db.collection(this.collection); 
//          //remove this hard code and inilitise it in the condtructor
//           //3.Insert the document.
//           await collection.insertOne(newProduct);
//            return newProduct;
//           }catch(err){
//               throw new ApplicationError("something went wrong with the database",500);
//           }
//  }

 async getAll(){
    try{
        
         const db=getDB();
         const collection = db.collection(this.collection); 
         return await collection.find().toArray();
          }catch(err){
              throw new ApplicationError("something went wrong with the database",500);
        }
 }
async  get(id){
    try{
        
        const db=getDB();
        const collection = db.collection(this.collection); 
        return await collection.find({_id:new ObjectId(id)}).toArray();
         }catch(err){
             throw new ApplicationError("something went wrong with the database",500);
       }
 }
//this filter based on in operator 
async filter(minPrice,categories){
    try{
        const db = getDB();
        const collection = db.collection(this.collection);
        let filterExpression={};
        if(minPrice){
            filterExpression.price = {$gte: parseFloat(minPrice)}
        }
       
        if(categories){
            filterExpression={$or:[{category:{$in:categories}},filterExpression]}
        }
        console.log("this is filterExpression",filterExpression);
        return await collection.find(filterExpression).project({name:1,price:1,ratings:{$slice:-1}}).toArray();
        
    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
    }
 }

//Product should have min price specifed and category
// async filter(minPrice,category){
//     try{
//         const db = getDB();
//         const collection = db.collection(this.collection);
//         let filterExpression={};
//         if(minPrice){
//             filterExpression.price = {$gte: parseFloat(minPrice)}
//         }
       
//         if(category){
//             filterExpression={$or:[{category:category},filterExpression]}
//         }
//         console.log("this is filterExpression",filterExpression);
//         return await collection.find(filterExpression).toArray();
        
//     }catch(err){
//         console.log(err);
//         throw new ApplicationError("Something went wrong with database", 500);
//     }
//  }

//  async filter(minPrice,maxPrice,category){
//     try{
//         const db = getDB();
//         const collection = db.collection(this.collection);
//         let filterExpression={};
//         if(minPrice){
//             filterExpression.price = {$gte: parseFloat(minPrice)}
//         }
//         if(maxPrice){
//             filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
//         }
//         if(category){
//             filterExpression.category=category;
//         }
//         console.log("this is filterExpression",filterExpression);
//         return await collection.find(filterExpression).toArray();
        
//     }catch(err){
//         console.log(err);
//         throw new ApplicationError("Something went wrong with database", 500);
//     }
//  }

async rate(userID, productID, rating){
    try{
        // 1. Check if product exists
        const productToUpdate = await ProductModel.findById(productID);
        if(!productToUpdate){
            throw new Error("Product not found")
        }

        // Find the existing review
        const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
        if(userReview){
            userReview.rating = rating;
            await userReview.save();
        }else{
            const newReview = new ReviewModel({
                product: new ObjectId(productID),
                user: new ObjectId(userID),
                rating: rating
            });
            newReview.save();
        }

    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);    
    }
}



//  async rate(userID,productID,rating){
//     try{
//         const db = getDB();
//         const collection = db.collection(this.collection);
//        //1.remove exsition entry
//        await collection.updateOne(
//         {
//           _id:new ObjectId(productID)
//         },
//         {
//            $pull:{ratings:{userID:new ObjectId(userID)}}
//         }
//        )
//        // 2.add entry
//        await  collection.updateOne(
//             {
//                 _id:new ObjectId(productID)
//             },
//             {
//                 $push:{ratings:{userID:new ObjectId(userID),rating}}
//             }
//         )
     
//     }catch(err){
//         console.log(err);
//         throw new ApplicationError("Something went wrong with database", 500);
//     }
//  }


//in this aproach thre might be possiblity of the race condiction
//  async rate(userID,productID,rating){
//     try{
//         const db = getDB();
//         const collection = db.collection(this.collection);
//         //1.find the product
//         const product=await collection.findOne({_id:new ObjectId(productID)});
//         console.log("product",product);
//         //2.check for the ratings
//         const userRating=product?.ratings?.find(r=>r.userID==userID);
//         console.log("userRating",userRating);
//         if(userRating){
//              //3.update the rating 
//              await collection.updateOne(
//                 {
                 
//                    _id:new ObjectId(productID),
//                    "ratings.userID":new ObjectId(userID)
                 
//                 },
//                 {
//                  $set:{
//                     "ratings.$.rating":rating
//                  }
//                 }
//             )
//         }else{
//        await  collection.updateOne(
//             {
//                 _id:new ObjectId(productID)
//             },
//             {
//                 $push:{ratings:{userID:new ObjectId(userID),rating}}
//             }
//         )
//      }
//     }catch(err){
//         console.log(err);
//         throw new ApplicationError("Something went wrong with database", 500);
//     }
//  }

async averageProductPricePerCategory(){
    try{
        // console.log("averageProductPricePerCategory hit's")
        const db=getDB();
        return await db.collection(this.collection)
            .aggregate([
                {
                    // Stage 1: Get Vaerge price per category
                    $group:{
                        _id:"$category",
                        averagePrice:{$avg:"$price"}
                    }
                }
            ]).toArray();
      
    }catch(err){
        console.log(err);
       throw new ApplicationError("Something went wrong with database", 500);
    }
}

async getAverageRating() {
    try {
      const db = getDB();
      return await db.collection(this.collection).
    aggregate([
          // 1. Create documents for ratings
          {
              $unwind:"$ratings"
          },
          // 2. Group rating per product and get average
          {
              $group:{
                  _id: "$name",
                  averageRating:{$avg:"$ratings.rating"}
              }
          }
      ]).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async countOfRatings() {
    try {
        const db = getDB();
        return await db.collection(this.collection)
            .aggregate([
                {
                    $project: {
                        name: 1,
                        countofRating: {
                            $cond: {
                                if: { $isArray: "$ratings" }, // Use $isArray instead of isArray
                                then: { $size: "$ratings" },
                                else: 0
                            }
                        }
                    }
                },
                {
                    //stage:2 sort the collection 
                    $sort:{countofRating:-1}
                },

                //stage:2 limit to only one
                {
                   $limit:1
                }
            

            ])
            .toArray();
    } catch (err) {
        console.log(err);
        throw new ApplicationError("Something went wrong with the database", 500);
    }
}

  
}

export default PorductRepository;