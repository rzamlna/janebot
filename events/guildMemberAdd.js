import { GuildConfig } from '../database/guildConfig.js';

export default async (client, member) => {
  const config = await GuildConfig.findOne({ guildId: member.guild.id });
  if (!config) return;

  // Auto role
  if (config.autoRoleId) {
    const role = member.guild.roles.cache.get(config.autoRoleId);
    if (role) await member.roles.add(role).catch(() => {});
  }

  // Welcome message
  if (config.welcomeChannelId) {
    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (channel) channel.send(`👋 Welcome, ${member.user}!`).catch(() => {});
  }
};
