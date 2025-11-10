import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ticketId: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, default: "open" },
  reply: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date, default: null }
});

export const Ticket = mongoose.model("Ticket", ticketSchema);
