import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Ticket } from "../../database/ticket.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ticket-create")
    .setDescription("Create a new support ticket")
    .addStringOption(o => o.setName("title").setDescription("Ticket title").setRequired(true))
    .addStringOption(o => o.setName("content").setDescription("Ticket content").setRequired(true)),
  async execute(interaction) {
    const title = interaction.options.getString("title");
    const content = interaction.options.getString("content");
    const ticketCount = await Ticket.countDocuments();
    const ticket = new Ticket({
      ticketId: ticketCount + 1,
      title,
      content,
      userId: interaction.user.id
    });
    await ticket.save();
    const embed = new EmbedBuilder()
      .setTitle(`🎟️ Ticket #${ticket.ticketId} Created`)
      .setDescription(`**Title:** ${title}\n**Content:** ${content}`)
      .setColor("#2b2d31")
      .setFooter({ text: `Created by ${interaction.user.username}` })
      .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
