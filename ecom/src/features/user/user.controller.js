import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from "bcrypt";
import mongoose from 'mongoose';

export default class UserController {
   constructor(){
    this.userRepository=new UserRepository();
    console.log("this.userRepository",this.userRepository)
   }
  
   async signUp(req, res, next) {
    const {
      name,
      email,
      password,
      type,
    } = req.body;
    try{
      
     const hashedPassword = await bcrypt.hash(password, 12)
    const user = new UserModel(
      name,
      email,
      hashedPassword,
      type
    );
    await this.userRepository.signUp(user);
    res.status(201).send(user);
  }catch(err){
    next(err);
  }
  }

  async signIn(req, res){
    try{
       const user=await this.userRepository.findByEmail(req.body.email);
       console.log("this is the user in Signin",user);
       if(!user){
        return res
        .status(400)
        .send('Incorrect Credentials');
       }else{
        //if we found the user then compare the password with the hashed password
        const result=await bcrypt.compare(req.body.password,user.password);

        if (!result){
          return res
            .status(400)
            .send('Incorrect Credentials');
        } else {
          // 1. Create token.
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '1h',
            }
          );
    
          // 2. Send token.
          return res.status(200).send(token);
        }
       }
    }catch(err){
      return res.status(500).send(err.message)
    }
   }

   async resetPassword(req, res, next){
    const {newPassword} = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    const userID = req.userID;
    try{
      await this.userRepository.resetPassword(userID, hashedPassword)
      res.status(200).send("Password is updated");
    }catch(err){
      console.log(err);
      console.log("Passing error to middleware");
      next(err);
    }
  }
  
}
