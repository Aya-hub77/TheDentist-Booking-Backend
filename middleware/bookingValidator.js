import { body, validationResult } from "express-validator";
export const validator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body('phone').trim().notEmpty().withMessage("Phone Number is required").isString().isMobilePhone().withMessage('Invalid phone number'),
  body('name').trim().notEmpty().withMessage('Full name is required').isLength({ min: 3, max: 100 }).custom(value => { if (value.split(/\s+/).length < 2) throw new Error ("Enter First and Last Name"); return true; }),
  body("service").isIn(["dental checkup", "root canal", "dental implant", "cosmetic treatment"]),
  body("status").isIn(["new patient", "returning patient"]),
  body("date").isISO8601().toDate().custom(value => { const today = new Date(); today.setHours(0, 0, 0, 0); if (value < today) { throw new Error("Date must be today or in the future"); } return true; }).withMessage("Invalid date"),
  body("time").matches(/^\d{2}:\d{2} - \d{2}:\d{2}$/)
];