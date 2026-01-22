import booking from "../models/booking.js";
import { validationResult } from "express-validator";

export const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { service, name, email, phone, date, time, status } = req.body;
    const existing = await booking.findOne({ date, time });
    if (existing) return res.status(400).json({ message: "❌ This slot is already booked. Please choose another time." });
    const newBooking = new booking({ service, name, email, phone, date, time, status });
    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
        return res.status(400).json({ message: "❌ This slot is already booked. Please choose another time." });
    }
    next(error);
  }
};