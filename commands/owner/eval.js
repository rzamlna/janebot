import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluate JS code (owner only)')
    .addStringOption(o => o.setName('code').setDescription('Code to run').setRequired(true)),
  async execute(interaction) {
    const code = interaction.options.getString('code');
    try {
      const result = await eval(`(async () => { ${code} })()`);
      await interaction.reply({ content: `\`\`\`js\n${String(result).slice(0,1900)}\n\`\`\``, ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: `Error: ${err.message}`, ephemeral: true });
    }
  }
};
