import mongoose from "mongoose";

const moderationCaseSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  action: { type: String, required: true },
  reason: { type: String, default: "No reason provided" },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number, default: null },
  active: { type: Boolean, default: true },
  caseId: { type: Number, required: true }
});

export const ModerationCase = mongoose.model("ModerationCase", moderationCaseSchema);
