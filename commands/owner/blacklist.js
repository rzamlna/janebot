import { SlashCommandBuilder } from 'discord.js';

// Simple in-memory blacklist example (persisting recommended)
const blacklist = { users: new Set(), guilds: new Set() };

export default {
  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Blacklist a user or guild (in-memory, owner only)')
    .addStringOption(o => o.setName('type').setDescription('user/guild').setRequired(true))
    .addStringOption(o => o.setName('id').setDescription('ID to blacklist').setRequired(true)),
  async execute(interaction) {
    const type = interaction.options.getString('type');
    const id = interaction.options.getString('id');
    if (type === 'user') { blacklist.users.add(id); return interaction.reply({ content: `Blacklisted user ${id}`, ephemeral: true }); }
    if (type === 'guild') { blacklist.guilds.add(id); return interaction.reply({ content: `Blacklisted guild ${id}`, ephemeral: true }); }
    return interaction.reply({ content: 'Type must be user or guild', ephemeral: true });
  }
};
