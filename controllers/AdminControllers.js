import Admin from "../models/Admin.js";
import booking from "../models/booking.js";
import Contact from "../models/Contact.js";
import bcrypt from "bcryptjs";


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) return res.status(400).json({ message:"Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({message:"Invalid credentials" });
    req.session.user = { id: user._id.toString(), username: user.username, email: user.email };
    req.session.save((err) => {
      if (err) return next(err);
      res.status(200).json({ message:'Logged in', user: req.session.user });
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

export const getSessionUser = (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({ user: req.session.user });
  }
  return res.status(401).json({ message: "Not logged in" });
};



export const appointments = async (req, res, next) => {
  try {
    const appoint = await booking.find({}, { createdAt: 0, updatedAt: 0, __v: 0 });
    const appointments = appoint.map(app => {
      const obj = app.toObject();
      obj.date = obj.date.toISOString().split('T')[0];
      return obj;
    });
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

export const appointmentStats = async (req, res, next) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const total = await booking.countDocuments({});
        const todayCount = await booking.countDocuments({ date: { $gte: startOfToday, $lt: endOfToday } });
        const weekCount = await booking.countDocuments({ date: { $gte: startOfWeek, $lt: endOfWeek } });
        const monthCount = await booking.countDocuments({ date: { $gte: startOfMonth, $lt: endOfMonth } });

        res.status(200).json({
            today: todayCount,
            thisWeek: weekCount,
            thisMonth: monthCount,
            total: total
        });
    } catch (error) {
        next(error);
    }
};

export const appointmentAnalytics = async (req, res, next) => {
  try {
    const monthly = await booking.aggregate([
      { $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        patients: { $sum: 1 } }},
      { $sort: { "_id.year": 1, "_id.month": 1 } } ]);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyFormatted = monthly.map(m => ({
      month: monthNames[m._id.month - 1],
      patients: m.patients
    }));

    const services = await booking.aggregate([ { $group: { _id: "$service", number: { $sum: 1 } } } ]);
    const servicesFormatted = services.map(s => ({
      service: s._id,
      number: s.number
    }));

    res.status(200).json({ monthly: monthlyFormatted, services: servicesFormatted });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({});
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updated = await Contact.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const changeEmail = async (req, res, next) => {
  try {
    const {oldEmail, newEmail, confirmEmail} = req.body;
    const emailDoc = await Admin.findOne();
    const email = emailDoc.email;
    if (oldEmail !== email) return res.status(400).json({message: "Wrong current email"});
    if (newEmail !== confirmEmail) return res.status(400).json({message: "Confirmation email doesn't match new email"});
    emailDoc.email = newEmail;
    await emailDoc.save();
    res.status(200).json({message: "Email updated successfully"});
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const {oldPassword, newPassword, confirmPassword} = req.body;
    const passwordDoc = await Admin.findOne();
    const password = passwordDoc.password;
    const match = await bcrypt.compare(oldPassword, password);
    if (!match) return res.status(400).json({message: "Wrong current password"});
    if (newPassword !== confirmPassword) return res.status(400).json({message: "confirmation password doesn't match new password"});
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    passwordDoc.password = hashedPassword;
    await passwordDoc.save();
    res.status(200).json({message: "Password updated Successfully"});
  } catch (err) {
    next(err);
  }
};