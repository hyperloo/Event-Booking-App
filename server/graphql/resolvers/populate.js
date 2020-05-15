const DataLoader = require("dataloader");

const Event = require("../../models/event");
const User = require("../../models/user");

const { DateToStr } = require("../../helpers/date");

const eventLoader = new DataLoader((eventIds) => {
  return eventsPopulate(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const eventsPopulate = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } }).then((events) => {
    //console.log(events);
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    return events.map((event) => {
      return transformEvent(event);
    });
  });
};

const userPopulate = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: async () =>
        await eventLoader.loadMany(
          user._doc.createdEvents
        ) /*events.bind(this, user._doc.createdEvents)*/,
    };
  } catch (err) {
    throw err;
  }
};

const singleEventPopulate = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    createdAt: DateToStr(booking._doc.createdAt),
    updatedAt: DateToStr(booking._doc.updatedAt),
    user: async () => await userPopulate(booking._doc.user),
    event: async () => await singleEventPopulate(booking._doc.event),
  };
};

const transformEvent = (event) => {
  // console.log("transform Event", event);
  return {
    ...event._doc,
    _id:
      event.id /* 'OR' we can do this by _id:event.id (this is a built in functionality of mongoose) */,
    date: DateToStr(event._doc.date),
    creator: async () => await userPopulate(event._doc.creator),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
