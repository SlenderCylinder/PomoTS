import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import {getAllCamperData, getCamperData} from "../modules/getCamperData";
import {MessageEmbed} from "discord.js";


export const view: CommandInt = {
    data: new SlashCommandBuilder()
      .setName("view")
      .setDescription("Shows your latest 100 Days of Code check in."),
    run: async (interaction) => {
      await interaction.deferReply();
      const { user } = interaction;
      console.log(`/view: executed by ${user.tag}`)
      const targetCamper = await getCamperData(user.id);
      const camperData = await getAllCamperData(user.id);

  
      if (!targetCamper.day) {
        await interaction.editReply({
          content:
            "It looks like you have not started the 100 Days of Code challenge yet. Use `/100` and add your message to report your first day!",
        });
        return;
      }
  
      const camperEmbed = new MessageEmbed();
      camperEmbed.setTitle("My 100DoC Progress");
      camperEmbed.setDescription(
        `Here is my 100 Days of Code progress. I last reported an update on ${new Date(
          targetCamper.timestamp
        ).toLocaleDateString()}.`
      );
      for (const camper of camperData) {
        camperEmbed.addField(
          `Round ${camper.round}, Day ${camper.day}`,
          `Reported on ${new Date(camper.timestamp).toLocaleDateString()}`,
          true
        );
      }
      camperEmbed.setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      });
  
      await interaction.editReply({ embeds: [camperEmbed] });
      console.log(`/view: finished executing`)
    },
  };