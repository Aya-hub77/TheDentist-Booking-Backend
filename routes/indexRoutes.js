import { Router } from "express";
import { createBooking } from "../controllers/bookingController.js";
import { sanitizeInput } from "../middleware/htmlSanitizer.js";
import { validator } from "../middleware/bookingValidator.js";
import { sendEmail } from "../controllers/emailController.js";
import { appointments, appointmentStats, appointmentAnalytics, login, logout, changeEmail, changePassword, getSessionUser } from "../controllers/AdminControllers.js";
import { getContact, updateContact } from "../controllers/AdminControllers.js";
import { verifySession } from "../middleware/verifySession.js";

const router = Router();
router.post("/booking", validator, sanitizeInput(["name", "email"]), createBooking);
router.get('/contact', getContact);
router.post("/send-email", sendEmail);
router.get('/me', getSessionUser);
router.post('/login', login);
router.post("/logout", logout);
router.get("/appointments", verifySession, appointments);
router.get('/stats', verifySession, appointmentStats);
router.get('/analytics', verifySession, appointmentAnalytics);
router.patch('/contact', verifySession, updateContact);
router.post('/changeEmail', verifySession, changeEmail);
router.post('/changePassword', verifySession, changePassword);
router.get("/", (req, res) => {
  res.send("API is running...");
});

export default router;