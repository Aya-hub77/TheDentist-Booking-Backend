import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    service: { type: String, required: true, enum: ['dental checkup', 'root canal', 'dental implant', 'cosmetic treatment'],},
    name: { type: String, required: true, trim: true, maxlength: 100},
    email: { type: String, required: true, lowercase: true},
    phone: { type: String, required: true, maxlength: 15, match: /^\+?[0-9]{7,15}$/},
    date: { type: Date, required: true},
    time: { type: String, required: true},
    status: { type: String, required: true, enum: ['new patient', 'returning patient'], },
}, { timestamps: true });
bookingSchema.index({ date: 1, time: 1 }, { unique: true });

export default mongoose.model("booking", bookingSchema);