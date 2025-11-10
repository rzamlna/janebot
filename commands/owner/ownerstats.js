import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import os from 'os';

export default {
  data: new SlashCommandBuilder().setName('ownerstats').setDescription('Show detailed bot statistics (owner only)'),
  async execute(interaction) {
    const client = interaction.client;
    const uptime = Math.floor(process.uptime());
    const embed = new EmbedBuilder()
      .setTitle("📊 Bot Statistics")
      .setColor("#00b894")
      .addFields(
        { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
        { name: "Users", value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`, inline: true },
        { name: "Ping", value: `${Math.round(client.ws.ping)}ms`, inline: true },
        { name: "Uptime (s)", value: `${uptime}`, inline: true },
        { name: "Platform", value: `${os.type()} ${os.release()}` },
        { name: "Memory Usage", value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB` }
      )
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
