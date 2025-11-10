import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Make bot leave a server by ID (owner only)')
    .addStringOption(o => o.setName('server_id').setDescription('Server ID to leave').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getString('server_id');
    const guild = interaction.client.guilds.cache.get(id);
    if (!guild) return interaction.reply({ content: 'Guild not found', ephemeral: true });
    await guild.leave();
    await interaction.reply({ content: `Left guild ${guild.name}`, ephemeral: true });
  }
};
