import { SlashCommandBuilder } from 'discord.js';
import { ModerationCase } from '../../database/moderationCase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user')
    .addUserOption(o => o.setName('user').setDescription('User to unmute').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found.', ephemeral: true });

    const muteRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
    if (!muteRole) return interaction.reply({ content: "No 'Muted' role found.", ephemeral: true });

    await member.roles.remove(muteRole).catch(() => {});
    await ModerationCase.updateMany({ guildId: interaction.guild.id, userId: user.id, action: 'mute', active: true }, { active: false }).catch(() => {});

    await interaction.reply({ content: `🔊 ${user.tag} has been unmuted` });
  }
};
