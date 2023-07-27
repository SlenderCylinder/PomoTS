import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import {getCamperData} from "../modules/getCamperData";
import {updateCamperData} from "../modules/updateCamperData";
import {MessageEmbed} from "discord.js";


export const oneHundred: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("100")
    .setDescription("Check in for the 100 Days of Code challenge.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to go in your 100 Days of Code update.")
        .setRequired(true)
    ),
    run: async (interaction) => {
        await interaction.deferReply();
        const { user } = interaction;
        const text = interaction.options.getString("message", true);

        const targetCamper = await getCamperData(user.id);
        const updatedCamper = await updateCamperData(targetCamper);

        const oneHundredEmbed = new MessageEmbed();
        oneHundredEmbed.setTitle("100 days counting up");
        oneHundredEmbed.setDescription(text);
        oneHundredEmbed.setAuthor({name: user.tag, iconURL: user.displayAvatarURL(),
        });
        
        oneHundredEmbed.addFields({name: "Round", value: updatedCamper.round.toString(), inline: true});
        oneHundredEmbed.addFields({name: "Day", value: updatedCamper.day.toString(), inline: true});
        oneHundredEmbed.setFooter({
            text:
            "Days counted: " + new Date(updatedCamper.timestamp).toLocaleDateString(),
            
        });

        await interaction.editReply({embeds: [oneHundredEmbed]});

      },

};