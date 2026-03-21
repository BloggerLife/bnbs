import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createEvent,
  getEvents,
  toggleEventAvailability,
  getOwnerEvents,
} from "../controllers/eventController.js";

const eventRouter = express.Router();

eventRouter.post("/", upload.array("images", 5), protect, createEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/owner", protect, getOwnerEvents);
eventRouter.post("/toggle-availability", protect, toggleEventAvailability);

export default eventRouter;
