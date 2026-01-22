import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    phone: String,
    address: String,
    email: String,
    workingHours: String,
    facebook: String,
    instagram: String,
    twitter: String,
    mapLink: String
});

export default mongoose.model("Contact", contactSchema);
