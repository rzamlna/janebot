import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ModerationCase } from '../../database/moderationCase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('modlogs')
    .setDescription('Show moderation logs for a user')
    .addUserOption(o => o.setName('user').setDescription('User to check').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const cases = await ModerationCase.find({ guildId: interaction.guild.id, userId: user.id }).sort({ caseId: -1 }).limit(20);
    if (!cases.length) return interaction.reply({ content: 'No moderation logs found for that user.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`📜 Mod Logs — ${user.tag}`)
      .setColor('#2b2d31')
      .setDescription(cases.map(c => `**#${c.caseId}** [${c.action}] by <@${c.moderatorId}> — ${c.reason} (<t:${Math.floor(c.timestamp/1000)}:R>)`).join('\n\n'))
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
