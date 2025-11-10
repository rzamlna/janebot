import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('help').setDescription('Show all available commands (interactive)'),
  async execute(interaction) {
    const commands = interaction.client.commands.map(cmd => ({ name: cmd.data.name, description: cmd.data.description, category: cmd.category || 'general' }));
    const categories = Array.from(new Set(commands.map(c => c.category)));
    const pages = categories.map(cat => {
      const items = commands.filter(c => c.category === cat);
      return new EmbedBuilder()
        .setTitle(`📚 ${cat[0].toUpperCase() + cat.slice(1)} Commands`)
        .setColor('#2b2d31')
        .setDescription(items.map(i => `**/${i.name}** — ${i.description || 'No description'}`).join('\n'))
        .setFooter({ text: `Requested by ${interaction.user.username}` })
        .setTimestamp();
    });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('prev').setLabel('⬅ Prev').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('next').setLabel('Next ➡').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('close').setLabel('Close ❌').setStyle(ButtonStyle.Danger)
    );

    let idx = 0;
    const message = await interaction.reply({ embeds: [pages[idx]], components: [buttons], ephemeral: true, fetchReply: true });

    const collector = message.createMessageComponentCollector({ time: 60000 });
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) return i.reply({ content: "You can't use these buttons.", ephemeral: true });
      if (i.customId === 'next') idx = (idx + 1) % pages.length;
      if (i.customId === 'prev') idx = (idx - 1 + pages.length) % pages.length;
      if (i.customId === 'close') {
        collector.stop('closed');
        return i.update({ content: '❎ Help menu closed.', embeds: [], components: [] });
      }
      await i.update({ embeds: [pages[idx]], components: [buttons] });
    });

    collector.on('end', (_, reason) => {
      if (reason !== 'closed') message.edit({ components: [] }).catch(() => {});
    });
  }
};
