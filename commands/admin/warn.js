import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ModerationCase } from '../../database/moderationCase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user and save the case')
    .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for warning')),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const caseCount = await ModerationCase.countDocuments({ guildId: interaction.guild.id });
    const newCase = new ModerationCase({ guildId: interaction.guild.id, userId: user.id, moderatorId: interaction.user.id, action: 'warn', reason, caseId: caseCount + 1 });
    await newCase.save();

    const embed = new EmbedBuilder()
      .setTitle('⚠️ User Warned')
      .setColor('#ffcc00')
      .addFields(
        { name: 'User', value: `<@${user.id}>`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case ID', value: `#${newCase.caseId}` }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
