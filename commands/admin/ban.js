import { SlashCommandBuilder } from 'discord.js';
import { ModerationCase } from '../../database/moderationCase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for ban')),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found.', ephemeral: true });
    if (!member.bannable) return interaction.reply({ content: "I can't ban this user.", ephemeral: true });

    await member.ban({ reason }).catch(() => {});
    const caseCount = await ModerationCase.countDocuments({ guildId: interaction.guild.id });
    const newCase = new ModerationCase({ guildId: interaction.guild.id, userId: user.id, moderatorId: interaction.user.id, action: 'ban', reason, caseId: caseCount + 1, active: false });
    await newCase.save();

    await interaction.reply({ content: `🔨 Banned **${user.tag}** | Case #${newCase.caseId}` });
  }
};
