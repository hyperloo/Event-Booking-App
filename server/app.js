const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");

const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/is-auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(isAuth);
app.use(cors()); //to enable cross origin requests

//We can use another middleware function like
/*
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if(req.method() === 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
})

*/

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-jwfcs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(`DB cannot be connected due to ${err}`));

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

//made because of error in fetching status in grapphql user load
app.get("/user", (req, res) => {
  if (req.isAuth) {
    console.log("Get Request passed", req.isAuth, req.email, req.userId);
    return res.status(200).send({ userId: req.userId, email: req.email });
  } else {
    console.log("Get Request failed", req.isAuth);
    return res
      .status(200)
      .send({ err: "No Valid Token, LogIn/ SignUp  Again" });
  }
});

app.listen(port, () => console.log(`Server started at ${port}`));
