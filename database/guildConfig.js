import mongoose from "mongoose";

const guildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  welcomeChannelId: String,
  autoRoleId: String,
  verifyMessageId: String,
  verifyRoleId: String,
  modLogChannelId: String
});

export const GuildConfig = mongoose.model("GuildConfig", guildConfigSchema);
