import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send a private message to a user (owner only)')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('message').setDescription('Message content').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const message = interaction.options.getString('message');
    try {
      await user.send(`💌 **Message from the bot owner:**\n${message}`);
      await interaction.reply({ content: `✅ Sent DM to ${user.tag}`, ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: '❌ Failed to send DM (user may have DMs off).', ephemeral: true });
    }
  }
};
