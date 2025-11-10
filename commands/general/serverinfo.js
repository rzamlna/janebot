import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Show information about this server'),
  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setTitle(`🏠 Server Info — ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: `${owner.user.tag}`, inline: true },
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>` },
        { name: 'Roles', value: `${guild.roles.cache.size} roles`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size} channels`, inline: true }
      )
      .setColor('#2b2d31')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
