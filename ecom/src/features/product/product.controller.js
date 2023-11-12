import ProductModel from "./product.model.js";
import PorductRepository from "./product.repository.js";
export default class ProductController{
    constructor(){
        this.PorductRepository=new PorductRepository();
    }
    
   async  getAllProducts(req,res){
        try{
            const products =await  this.PorductRepository.getAll();
            res.status(200).send(products);
        }catch(err){
            return res.status(500).send(err.message);
        }
     
    }

   async  addProduct(req, res){
    try{
        const {name, price, sizes,categories} = req.body;
        const imageUrl = req.file.filename;
        console.log(imageUrl);
        console.log("this is the image url in add product imageUrl",imageUrl)
         const newProduct = new ProductModel(
            name,
            null,
            parseFloat(price), 
            req.file.filename,
            categories,
           sizes.split(','),
           
           );
        const createdRecord=await this.PorductRepository.add(newProduct);
        res.status(201).send(createdRecord);

    }catch(err){
        return res.status(500).send(err.message)
    }     
}

   async rateProduct(req,res){
    console.log("the rate produt hit's")
    try{
      const userID=req.userID;
      const productID=req.body.productID;
      const rating=req.body.rating;
      console.log("userid",userID,"productID",productID,"rating",rating);
      
      await this.PorductRepository.rate(
            userID,
            productID,
            rating
          );
          console.log(req.query);
          return res.status(200)
          .send("Ratings has been added");
        }catch(err){
            return res.status(400).send(err.message)
        }
        
      } 
    //or we can handlwe the error this way the catch block will go to the application level for to handle this error.
    //   rateProduct(req, res, next) {
    //     console.log(req.query);
    //     try{
    //       const userID = req.query.userID;
    //       const productID = req.query.productID;
    //       const rating = req.querys.rating;
    //       ProductModel.rateProduct(
    //         userID,
    //         productID, 
    //         rating
    //         );
    //         return res
    //           .status(200)
    //           .send('Rating has been added');
    //     } catch(err){
    //       console.log("Passing error to middleware");
    //       next(err);
    //     }
    
    //     }

   async getOneProduct(req,res){
        
        try{
            const id = req.params.id;
            const products =await  this.PorductRepository.get(id);
            res.status(200).send(products);
        }catch(err){
            return res.status(500).send(err.message);
        }
    }
    //this filter base on the in operator
    async  filterProducts(req, res) {
        try{
            const minPrice = req.query.minPrice;
            let categories = req.query.categories;
            categories=JSON.parse(categories.replace(/'/g,'"'))
            console.log("minPrice",minPrice,"categories",categories);
            const result = await this.PorductRepository.filter(
                minPrice,
                categories
            );

            console.log("this is the result",result);
            res.status(200).send(result);

        }catch(err){
          res.status(500).send(err.message);
        }
  }
   //new filter code bease on the and operator
//     async  filterProducts(req, res) {
//         try{
//             const minPrice = req.query.minPrice;
//             const category = req.query.category;
//             console.log("minPrice",minPrice,"category",category);
//             const result = await this.PorductRepository.filter(
//                 minPrice,
//                 category
//             );

//             console.log("this is the result",result);
//             res.status(200).send(result);

//         }catch(err){
//           res.status(500).send(err.message);
//         }
//   }
//old filter base or condiction 
//    async  filterProducts(req, res) {
//         try{

//             const minPrice = req.query.minPrice;
//             const maxPrice = req.query.maxPrice;
//             const category = req.query.category;
//             const result = await this.PorductRepository.filter(
//                 minPrice,
//                 maxPrice,
//                 category
//             );

//             console.log("this is the result",result);
//             res.status(200).send(result);

//         }catch(err){
//           res.status(500).send(err.message);
//         }
       
//     }

async averagePrice(req,res,next){
    try{
       console.log("average price hit's")
    const result= await this.PorductRepository.averageProductPricePerCategory() 
    console.log("this is result result",result);
    res.status(200).send(result);
    }catch(err){
      return res.status(500).send("Internal server error");
    }
  }

  async averageratings(req,res){
    try{
        console.log("average price hit's")
     const result= await this.PorductRepository.getAverageRating() 
     console.log("this is result result",result);
     res.status(200).send(result);
     }catch(err){
       return res.status(500).send("Internal server error");
     }
  }

  async countRatings(req,res){
    try{
        console.log("average price hit's")
     const result= await this.PorductRepository.countOfRatings() 
     console.log("this is result result",result);
     res.status(200).send(result);
     }catch(err){
       return res.status(500).send("Internal server error");
     }
  }

}