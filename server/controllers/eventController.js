import Hotel from "../models/Hotel.js";
import Room from "../models/Event.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new event for a hotel
// POST /api/events
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      description,
      pricePerNight,
      checkInDate,
      amenities,
    } = req.body;

    const hotel = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotel)
      return res.json({ success: false, message: "No Business found" });

    // upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    const createdEvent = await Event.create({
      hotel: hotel._id,
      checkInDate,
      name,
      address,
      city,
      description,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    // After successful creation, redirect to the newly created event resource
    return res.redirect(`/api/events/${createdEvent._id}`);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all events
// GET /api/events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all events for a specific hotel
// GET /api/events/owner
export const getOwnerEvents = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });
    const events = await Event.find({
      hotel: hotelData._id.toString(),
    }).populate("hotel");
    res.json({ success: true, events });
  } catch (error) {
    console.log(error);

    res.json({ success: false, message: error.message });
  }
};

// API to toggle availability of an event
// POST /api/events/toggle-availability
export const toggleEventAvailability = async (req, res) => {
  try {
    const { eventId } = req.body;
    const eventData = await Event.findById(eventId);
    eventData.isAvailable = !eventData.isAvailable;
    await eventData.save();
    res.json({ success: true, message: "Event availability Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
