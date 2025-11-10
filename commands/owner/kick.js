import { SlashCommandBuilder } from 'discord.js';
import { ModerationCase } from '../../database/moderationCase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for kick')),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found.', ephemeral: true });
    if (!member.kickable) return interaction.reply({ content: "I can't kick this user.", ephemeral: true });

    await member.kick(reason).catch(() => {});
    const caseCount = await ModerationCase.countDocuments({ guildId: interaction.guild.id });
    const newCase = new ModerationCase({ guildId: interaction.guild.id, userId: user.id, moderatorId: interaction.user.id, action: 'kick', reason, caseId: caseCount + 1, active: false });
    await newCase.save();

    await interaction.reply({ content: `👢 Kicked **${user.tag}** | Case #${newCase.caseId}` });
  }
};
