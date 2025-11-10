import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('guilds').setDescription('List all servers where bot is present (owner only)'),
  async execute(interaction) {
    const client = interaction.client;
    const guilds = client.guilds.cache.map(g => `• **${g.name}** — ${g.memberCount} members`).join('\n').slice(0, 4000);
    const embed = new EmbedBuilder().setTitle(`🗂️ Guild List (${client.guilds.cache.size})`).setDescription(guilds || "No guilds found.").setColor('#6c5ce7');
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
