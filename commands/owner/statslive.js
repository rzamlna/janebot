import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import os from 'os';

export default {
  data: new SlashCommandBuilder().setName('statslive').setDescription('Show live stats with refresh button (owner only)'),
  async execute(interaction) {
    const makeEmbed = () => new EmbedBuilder()
      .setTitle('📊 Live Bot Stats')
      .addFields(
        { name: 'Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
        { name: 'Users', value: `${interaction.client.guilds.cache.reduce((a,g)=>a+g.memberCount,0)}`, inline: true },
        { name: 'Ping', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
        { name: 'Memory', value: `${(process.memoryUsage().rss/1024/1024).toFixed(2)} MB`, inline: true },
      ).setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('refresh').setLabel('Refresh').setStyle(ButtonStyle.Primary)
    );

    const msg = await interaction.reply({ embeds: [makeEmbed()], components: [row], ephemeral: true, fetchReply: true });

    const collector = msg.createMessageComponentCollector({ time: 60000 });
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) return i.reply({ content: "You can't use this.", ephemeral: true });
      if (i.customId === 'refresh') {
        await i.update({ embeds: [makeEmbed()], components: [row] });
      }
    });
  }
};
