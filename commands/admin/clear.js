import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete a number of messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    if (amount < 1 || amount > 100) return interaction.reply({ content: 'Amount must be between 1 and 100.', ephemeral: true });
    const deleted = await interaction.channel.bulkDelete(amount, true).catch(() => null);
    await interaction.reply({ content: `🧹 Deleted ${deleted ? deleted.size : 0} messages.`, ephemeral: true });
  }
};
