import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();

// Load commands from subfolders
const commandFolders = fs.readdirSync(path.join(__dirname, "commands"));
for (const folder of commandFolders) {
  const folderPath = path.join(__dirname, "commands", folder);
  if (!fs.lstatSync(folderPath).isDirectory()) continue;
  const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));
  for (const file of commandFiles) {
    const fullPath = `./commands/${folder}/${file}`;
    const imported = await import(fullPath);
    const cmd = imported.default;
    cmd.category = folder;
    client.commands.set(cmd.data.name, cmd);
    console.log(chalk.green(`[CMD] Loaded ${cmd.data.name} (${folder})`));
  }
}

// Load events
const eventFiles = fs.readdirSync(path.join(__dirname, "events")).filter(f => f.endsWith(".js"));
for (const file of eventFiles) {
  const imported = await import(`./events/${file}`);
  const eventName = file.split(".")[0];
  client.on(eventName, (...args) => imported.default(client, ...args));
  console.log(chalk.blue(`[EVT] Loaded ${eventName}`));
}

// Connect MongoDB
if (!process.env.MONGO_URI) console.warn("[DB] MONGO_URI not set in .env");
mongoose.connect(process.env.MONGO_URI, { keepAlive: true })
  .then(() => console.log(chalk.yellow("[DB] Connected to MongoDB")))
  .catch(err => console.error("[DB] Error:", err));

// Start dashboard (optional)
try {
  await import('./dashboard/server.js');
} catch (e) {
  console.warn('Dashboard failed to load (optional):', e.message);
}

if (!process.env.TOKEN) console.error("TOKEN is not set in .env");
client.login(process.env.TOKEN).catch(err => console.error('Login error:', err));
