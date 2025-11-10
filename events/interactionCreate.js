import { PermissionsBitField } from 'discord.js';
const OWNER_ID = process.env.OWNER_ID;

export default async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    // Owner bypass
    if (interaction.user.id === OWNER_ID) {
      await command.execute(interaction);
      return;
    }

    // Admin commands require KickMembers (customize if needed)
    if (command.category === 'admin') {
      const memberPerms = interaction.member?.permissions;
      if (!memberPerms || !memberPerms.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply({ content: '🚫 You don’t have permission to use admin commands.', ephemeral: true });
      }
    }

    // Owner-only category already blocked above

    await command.execute(interaction);
  } catch (err) {
    console.error('Command execution error:', err);
    if (!interaction.replied) await interaction.reply({ content: '⚠️ There was an error executing this command.', ephemeral: true });
  }
};
