//loads all the environement veriable in the cofigration
import "./env.js";
// 1. Import express
import express from 'express';
import swagger from 'swagger-ui-express'
import cors from "cors"
import winston from "winston";
import mongoose from "mongoose";

// import bodyParser from 'body-parser';
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cartitems/cartitems.routes.js'
import jwtAuth from "./src/middlewares/jwt.middleware.js"

import apiDocs from "./swagger.json" assert{type:'json'};

import {connectToMongoDB,getDB} from "./src/config/mongodb.js"

// import loggerMiddleware from "./src/middlewares/logger.middleware.js"
import loggerMiddleware from "./src/middlewares/logger.middleware.windson.js"
import {logger} from "./src/middlewares/logger.middleware.windson.js"
import { ApplicationError } from './src/error-handler/applicationError.js';
import orderRouter from "./src/features/order/order.routes.js";
import {connectUsingMongoose} from "./src/config/mongooseCofig.js"
import likeRouter from "./src/features/like/like.routes.js"

// 2. Create Server
const server = express();

server.use(express.json());

server.use(loggerMiddleware);



// server.use(bodyParser.json());
// for all requests related to product, redirect to product routes.

server.use("/api-docs",
swagger.serve,
swagger.setup(apiDocs)
);


// localhost:3200/api/products
server.use("/api/products",
                jwtAuth,
              productRouter
              );
server.use("/api/users",  
              userRouter
          )
// 3. Default request handler
server.use("/api/orders",
          jwtAuth,
          orderRouter
);

server.use("/api/cartItems",
                jwtAuth,
                cartRouter
            );
server.use('/api/likes',
             jwtAuth, 
             likeRouter
            )
            
server.get('/', (req, res)=>{
    res.send("Welcome to Ecommerce APIs");
});

//CORS policy configration.

// server.use((req,res,next)=>{
//     //url can be specicific like http://localhost:5500 or '*' to allow all the url to access data
//   res.header('ACCESS-Control-Allow-Origin','*') 
//   res.header('Access-Control-Allow-Headers',,'*')
//   res.header('Access-Control-Allow-Methods','*')
//   //return ok for preflight request.
//   if(req.method =="OPTIONS"){
//       return res.sendStatus(200);
//   }
//   next(); 
// })

//the same code using the cors module
var corsOptions={
    origin:'*',

}
server.use(cors);

// Error handler middleware
server.use((err, req, res, next) => {
  console.log(err);
  if(err instanceof mongoose.Error.ValidationError){
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  // server errors.
  res
    .status(500)
    .send(
      'Something went wrong, please try later'
    );
});

//4.Middleware to handle 404 requests.
server.use((req,res)=>{
    res.status(404).send("API not found. please check our documentation for more ");
})


// 4. Specify port.
server.listen(3200,()=>{
    console.log("Server is running at 3200");
    //connectToMongoDB();
    connectUsingMongoose();
});

