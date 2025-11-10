import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Ticket } from "../../database/ticket.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ticket-close")
    .setDescription("Close a ticket (owner only)")
    .addIntegerOption(o => o.setName("id").setDescription("Ticket ID to close").setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getInteger("id");
    const ticket = await Ticket.findOne({ ticketId: id });
    if (!ticket) return interaction.reply({ content: "Ticket not found.", ephemeral: true });
    if (ticket.status === "closed") return interaction.reply({ content: "Ticket already closed.", ephemeral: true });

    ticket.status = "closed";
    ticket.closedAt = new Date();
    await ticket.save();

    const embed = new EmbedBuilder()
      .setTitle(`✅ Ticket #${id} Closed`)
      .setDescription(`**Title:** ${ticket.title}\n**Status:** Closed`)
      .setColor("#e17055")
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });

    try {
      const user = await interaction.client.users.fetch(ticket.userId);
      await user.send(`✅ Your ticket **#${id}** has been closed. Thank you!`);
    } catch {
      console.log("Failed to DM user on ticket close.");
    }
  }
};
