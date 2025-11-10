import { GuildConfig } from '../database/guildConfig.js';

export default async (client, reaction, user) => {
  if (user.bot) return;
  if (!reaction.message.guild) return;
  const config = await GuildConfig.findOne({ guildId: reaction.message.guild.id });
  if (!config) return;

  if (reaction.message.id === config.verifyMessageId && reaction.emoji.name === '✅') {
    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return;
    const role = reaction.message.guild.roles.cache.get(config.verifyRoleId);
    if (role) await member.roles.add(role).catch(() => {});
  }
};
