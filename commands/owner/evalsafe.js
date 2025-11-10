import { SlashCommandBuilder } from 'discord.js';
import vm from 'vm';

export default {
  data: new SlashCommandBuilder()
    .setName('evalsafe')
    .setDescription('Evaluate JS code in a basic sandbox (owner only)')
    .addStringOption(o => o.setName('code').setDescription('Code to run').setRequired(true)),
  async execute(interaction) {
    const code = interaction.options.getString('code');
    try {
      const sandbox = { result: null };
      vm.createContext(sandbox);
      vm.runInContext(`result = (async () => { ${code} })()`, sandbox, { timeout: 2000 });
      const res = await sandbox.result;
      await interaction.reply({ content: `\`\`\`js\n${String(res).slice(0,1900)}\n\`\`\``, ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: `Error: ${err.message}`, ephemeral: true });
    }
  }
};
