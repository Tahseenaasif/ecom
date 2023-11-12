import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import {categorySchema} from "../features/product/category.schema.js"
const url =process.env.DB_URL;
export const connectUsingMongoose=async()=>{ try{
    await mongoose.connect(url,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    console.log("Mongodb connected using mongoose");
    addCategories();
   }catch(err){
    console.log("err while conneting to db",err);

   }
    
}

async  function addCategories(){
    const CategoryModel=mongoose.model("Category",categorySchema);
    const categories=CategoryModel.find();
    if(!categories ||(await categories).length==0){
     await CategoryModel.insertMany(
       [{
            name:'Book'
        },
        {
          name:'Clothing'  
        },
        {
          name:'Electronics'  
        }
    ]
     );
    }

    console.log("categories added");

}