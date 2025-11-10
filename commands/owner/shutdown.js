import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('shutdown').setDescription('Shutdown the bot (owner only)'),
  async execute(interaction) {
    await interaction.reply({ content: 'Shutting down...', ephemeral: true });
    process.exit(0);
  }
};
