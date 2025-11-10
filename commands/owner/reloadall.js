import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

export default {
  data: new SlashCommandBuilder().setName('reloadall').setDescription('Reload all commands (owner only)'),
  async execute(interaction) {
    const base = path.join(process.cwd(), 'commands');
    const folders = fs.readdirSync(base);
    let count = 0;
    for (const folder of folders) {
      const files = fs.readdirSync(path.join(base, folder)).filter(f => f.endsWith('.js'));
      for (const f of files) {
        try {
          const filePath = path.join(base, folder, f);
          const imported = await import(`file://${filePath}?update=${Date.now()}`);
          const cmd = imported.default;
          cmd.category = folder;
          interaction.client.commands.set(cmd.data.name, cmd);
          count++;
        } catch (e) { console.error('reloadall error', e); }
      }
    }
    await interaction.reply({ content: `♻️ Reloaded ${count} commands`, ephemeral: true });
  }
};
