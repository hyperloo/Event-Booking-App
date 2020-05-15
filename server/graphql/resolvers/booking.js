const Booking = require("../../models/booking");
const Event = require("../../models/event");

const { transformBooking, transformEvent } = require("./populate");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    let result;
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const fetchedEvent = await Event.findById(args.eventId);
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      });
      result = await booking.save();
    } catch (err) {
      throw err;
    }
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
