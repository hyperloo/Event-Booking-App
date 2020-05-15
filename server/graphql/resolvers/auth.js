const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  // createUser: async (args) => {
  //   const salt = await bcrypt.genSalt(12);
  //   const hashedPassword = await bcrypt.hash(args.userInput.password, salt);
  //   const user = new User({
  //     email: args.userInput.email,
  //     password: hashedPassword,
  //   });
  //   const newUser = await user.save();
  //   return { ...newUser._doc, password: null, _id: newUser.id };
  // },
  users: () => {
    return User.find({}).then((users) => {
      return users.map((user) => {
        return {
          ...user._doc,
          password: null,
          createdEvents: () => eventsPopulate(user._doc.createdEvents),
        };
      });
    });
  },
  user: (args, req) => {
    try {
      // console.log(req.isAuth);
      if (!req.isAuth) {
        throw new Error("Login/ SignUp first");
      }
      return { _id: req.userId, email: req.email };
    } catch (err) {
      // console.log("token middleware response", err);
      return { _id: req.userId, email: req.email };
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const prevUser = await User.findOne({ email: args.userInput.email });
      if (prevUser) {
        throw new Error("User already Exist");
      }
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(args.userInput.password, salt);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      console.log("user", user);
      const result = await user.save();
      console.log("result", result);
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET
        // { expiresIn: 60 }
      );
      return { ...result._doc, password: null, _id: result._id, token: token };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }, req) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User does not Exist!");
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Invalid Password!");
      }
      const token = await jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET
        // { expiresIn: 60 }
      );
      return { userId: user.id, token: token, tokenExpiration: 60 };
    } catch (err) {
      throw err;
    }
  },
};
