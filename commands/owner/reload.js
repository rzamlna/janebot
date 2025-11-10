import { SlashCommandBuilder } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload a command (owner only)')
    .addStringOption(o => o.setName('command').setDescription('Command name').setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('command');
    const cmd = interaction.client.commands.get(name);
    if (!cmd) return interaction.reply({ content: 'Command not found', ephemeral: true });

    try {
      const category = cmd.category || 'general';
      const filePath = path.join(process.cwd(), 'commands', category, `${name}.js`);
      const imported = await import(`file://${filePath}?update=${Date.now()}`);
      const newCmd = imported.default;
      newCmd.category = category;
      interaction.client.commands.set(newCmd.data.name, newCmd);
      return interaction.reply({ content: `♻️ Reloaded ${name}`, ephemeral: true });
    } catch (err) {
      console.error('Reload error:', err);
      return interaction.reply({ content: 'Failed to reload command', ephemeral: true });
    }
  }
};
