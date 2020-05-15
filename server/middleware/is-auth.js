const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  // const authHeader = await req.header("Authorization");
  const token = await req.header("x-auth-token");
  // console.log(token);
  // if (!authHeader) {
  //   req.isAuth = false;
  //   return next();
  // }
  // const token = authHeader.split(" ")[1];
  if (!token || token === " ") {
    req.isAuth = false;
    // console.log("No Token");
    // res.status(200).send({ err: "No Valid Token, Login/SignUp Again" });
    return next();
  }
  let decodedToken;

  try {
    decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken);
  } catch (err) {
    req.isAuth = false;
    // console.log("Token Decode Error");
    // res.status(200).send({ err: "No Valid Token, Login/SignUp Again" });
    return next();
  }

  if (!decodedToken) {
    // console.log("Invalid Token");
    req.isAuth = false;
    // res.status(200).send({ err: "No Valid Token, Login/SignUp Again" });
    return next();
  }

  // console.log("Valid Token");
  req.isAuth = true;
  req.userId = decodedToken.userId;
  req.email = decodedToken.email;
  return next();
};
