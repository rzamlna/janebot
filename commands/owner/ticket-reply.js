import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Ticket } from "../../database/ticket.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ticket-reply")
    .setDescription("Reply to a ticket (owner only)")
    .addIntegerOption(o => o.setName("id").setDescription("Ticket ID").setRequired(true))
    .addStringOption(o => o.setName("message").setDescription("Reply message").setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getInteger("id");
    const message = interaction.options.getString("message");
    const ticket = await Ticket.findOne({ ticketId: id });
    if (!ticket) return interaction.reply({ content: "Ticket not found.", ephemeral: true });
    if (ticket.status === "closed") return interaction.reply({ content: "Ticket already closed.", ephemeral: true });

    ticket.reply = message;
    await ticket.save();

    const embed = new EmbedBuilder().setTitle(`📨 Ticket #${id} Replied`).setDescription(`**Reply:** ${message}`).setColor("#00b894").setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });

    // DM ticket owner
    try {
      const user = await interaction.client.users.fetch(ticket.userId);
      await user.send(`💬 Your ticket **#${id}** has been replied:\n> ${message}`);
    } catch {
      console.log("DM failed (user might have DMs disabled)");
    }
  }
};
