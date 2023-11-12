import {getDB} from "../../config/mongodb.js"
import { ApplicationError } from "../../error-handler/applicationError.js";
export default class UserModel{
    constructor(name,email,password,type,id){
        this.name=name;
        this.email=email;
        this.password=password;
        this.type=type;
        this._id=id;

    }
}
//    static  async  signUp(name,email,password,type){
//         try{
//             //1.Get the database
//        const db=getDB();
//        //2.get the collection
//        const collection = db.collection("users");
//          // 
//           const newUser=new UserModel(
//           name,
//           email,
//          password,
//          type
//          );
//         //3.Insert the document.
//         await collection.insertOne(newUser);
//          return newUser;
//         }catch(err){
//             throw new ApplicationError("something went wrong",500);
//         }
    
//     }

//     static signIn(email,password){
//         const user=users.find((user)=>{
//             return (user.email== email && user.password==password)
//         });

//         return user;
//     }

//     static getAll(req,res){
//         return users;
//     }
// }

// let users=[
//     { id:1,
//      name:'admin',
//      email:'customer@ecom.com',
//      password:'Password1',
//      type:'seller'
//    },
//    { id:1,
//     name:'admin',
//     email:'seller@ecom.com',
//     password:'Password1',
//     type:'customer'
//   } 

//]