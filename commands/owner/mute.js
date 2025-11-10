import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ModerationCase } from '../../database/moderationCase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user for minutes')
    .addUserOption(o => o.setName('user').setDescription('User to mute').setRequired(true))
    .addIntegerOption(o => o.setName('duration').setDescription('Duration in minutes').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for mute')),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found.', ephemeral: true });

    let muteRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
    if (!muteRole) {
      muteRole = await interaction.guild.roles.create({ name: 'Muted', permissions: [] }).catch(() => null);
      if (muteRole) {
        interaction.guild.channels.cache.forEach(ch => {
          ch.permissionOverwrites.edit(muteRole, { SendMessages: false, Speak: false }).catch(() => {});
        });
      }
    }

    if (!muteRole) return interaction.reply({ content: '⚠️ Could not create/find Muted role.', ephemeral: true });

    await member.roles.add(muteRole).catch(() => {});

    const caseCount = await ModerationCase.countDocuments({ guildId: interaction.guild.id });
    const newCase = new ModerationCase({ guildId: interaction.guild.id, userId: user.id, moderatorId: interaction.user.id, action: 'mute', reason, caseId: caseCount + 1, duration: duration * 60000 });
    await newCase.save();

    const embed = new EmbedBuilder()
      .setTitle('🔇 User Muted')
      .setColor('#ff9966')
      .addFields(
        { name: 'User', value: `<@${user.id}>`, inline: true },
        { name: 'Duration', value: `${duration} minutes`, inline: true },
        { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case ID', value: `#${newCase.caseId}` }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Auto unmute
    setTimeout(async () => {
      const refreshed = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (refreshed && refreshed.roles.cache.has(muteRole.id)) {
        await refreshed.roles.remove(muteRole).catch(() => {});
        await ModerationCase.updateOne({ guildId: interaction.guild.id, caseId: newCase.caseId }, { active: false }).catch(() => {});
      }
    }, duration * 60000);
  }
};
