import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) =>{
  // 1. Check if authorization header is empty
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("No authorization details found");
  }
   
  console.log(authHeader);
  // 2. Extract credentials. [Basic qweryusdfdgsdsdcsd]
  const base64Credentials = authHeader.replace("Basic ", ""); 
  console.log(base64Credentials);
  // 3. Decode the credentials
  const decodedCreds = Buffer.from(base64Credentials, "base64").toString("utf8");
  console.log(decodedCreds); // [username:password]
  const creds = decodedCreds.split(":");

  // 4. Use `find` to check if user credentials match
  const user = UserModel.getAll().find((u) => u.email === creds[0] && u.password === creds[1]);

  if (user) {
    next();
  } else {
    return res.status(401).send("Invalid Credentials"); // Corrected the typo in the response message
  }
};

export default basicAuthorizer;
