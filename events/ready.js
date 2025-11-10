export default async (client) => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Register global commands
  try {
    const cmds = client.commands.map(c => c.data);
    await client.application.commands.set(cmds);
    console.log('🌍 Global commands registered');
  } catch (err) {
    console.error('Error registering global commands:', err);
  }
};
