// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
// 2. Initialize Express router.
const userRouter = express.Router();
const UserControllerr = new UserController();

// All the paths to the controller methods.
// localhost/api/products 
// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1


userRouter.post('/signup',(req,res,next)=>{
    UserControllerr.signUp(req,res,next);
});

userRouter.post(
    '/signin', 
    (req,res)=>{
        UserControllerr.signIn(req,res,);
    }
);

userRouter.put(
    '/resetPassword', 
    jwtAuth,
    (req,res)=>{
        UserControllerr.resetPassword(req,res);
    }
);


export default userRouter;