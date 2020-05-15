const Event = require("../../models/event");
const User = require("../../models/user");

const { DateToStr } = require("../../helpers/date");
const { transformEvent } = require("./populate");

module.exports = {
  events: () => {
    return Event.find({})
      .then((events) =>
        events.map((event) => {
          return transformEvent(event);
        })
      )
      .catch((err) => {
        throw err;
      });
  },
  createEvent: async (args, req) => {
    /*const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.price,
          date: args.eventInput.date,
        };*/
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated!");
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: DateToStr(args.eventInput.date),
        creator: req.userId,
      });
      var result;
      result = await event.save();

      var user;

      user = await User.findById(result.creator);
      if (!user) {
        throw new Error("User Not Found!");
      }

      await user.createdEvents.push(result._id);
      await user.save();
      return transformEvent(result);
    } catch (err) {
      throw err;
    }
  },
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
};
