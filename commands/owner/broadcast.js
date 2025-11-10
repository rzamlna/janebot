import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription('Send a message to all servers (owner only)')
    .addStringOption(o => o.setName('message').setDescription('Message to broadcast').setRequired(true)),
  async execute(interaction) {
    const msg = interaction.options.getString('message');
    const client = interaction.client;
    let sent = 0;
    for (const guild of client.guilds.cache.values()) {
      const systemChannel = guild.systemChannel || guild.channels.cache.find(c => c.isTextBased() && c.permissionsFor(guild.members.me).has('SendMessages'));
      if (systemChannel) {
        try { await systemChannel.send(`📢 **Broadcast:** ${msg}`); sent++; } catch (_) {}
      }
    }
    await interaction.reply({ content: `✅ Broadcast sent to ${sent} servers.`, ephemeral: true });
  }
};
