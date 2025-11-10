import { SlashCommandBuilder } from 'discord.js';
import { GuildConfig } from '../../database/guildConfig.js';

export default {
  data: new SlashCommandBuilder().setName('verify').setDescription('Send verification message with ✅ reaction'),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const config = await GuildConfig.findOne({ guildId });
    if (!config?.verifyRoleId) return interaction.reply({ content: '⚠️ Please set verify role first using /setup', ephemeral: true });

    const msg = await interaction.reply({ content: '✅ React with ✅ to verify yourself', fetchReply: true });
    await msg.react('✅');

    if (!config) {
      const newCfg = new GuildConfig({ guildId, verifyMessageId: msg.id });
      await newCfg.save();
    } else {
      config.verifyMessageId = msg.id;
      await config.save();
    }

    await interaction.followUp({ content: '✅ Verification message sent', ephemeral: true });
  }
};
