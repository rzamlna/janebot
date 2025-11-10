import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Ticket } from "../../database/ticket.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ticket-list")
    .setDescription("Show all tickets (open or closed)")
    .addStringOption(o => o.setName("status").setDescription("Filter by status: open or closed").setRequired(false)),
  async execute(interaction) {
    const status = interaction.options.getString("status");
    const filter = status ? { status } : {};
    const tickets = await Ticket.find(filter).sort({ ticketId: -1 }).limit(20);
    if (!tickets.length) return interaction.reply({ content: "No tickets found.", ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle("📋 Ticket List")
      .setDescription(tickets.map(t => `**#${t.ticketId}** — ${t.title} (${t.status.toUpperCase()})\nBy <@${t.userId}> — <t:${Math.floor(t.createdAt/1000)}:R>`).join("\n\n"))
      .setColor("#2b2d31")
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
