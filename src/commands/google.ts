import { SlashCommandBuilder} from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import {MessageEmbed, MessageButton, MessageActionRow} from "discord.js";
import { google as google_api } from 'googleapis';

let searchResult:any;
let row:any;
export let res_num: number;

export const google: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("google")
    .setDescription("Search on Google")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Search query to be sent to Google")
        .setRequired(true)
    ),
    run: async (interaction) => {
        res_num = 0
        await interaction.deferReply();
        const { user } = interaction;
        const message = interaction.options.getString("query", true);

        const query = message.slice(7);
        searchResult = await google_api.customsearch('v1').cse.list({
            cx: 'f5ed394fb38a545fe',
            q: message,
            auth:'AIzaSyCBkCenNgKgvVbWNm4Hk27FUtgBLjfCx3o',
          });

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
					.setCustomId('back')
					.setLabel('Back')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle('PRIMARY')
                );
        
          

        const firstResultEmbed = resultsEmbed(0)

        if (!firstResultEmbed) {;
          return;
        }

        await interaction.editReply({content: "Result: 1", embeds: [firstResultEmbed], components: [row]});


      },

};

export {row};
export function resultsEmbed(num: number){
  var resultItems = searchResult.data.items;
  if (!resultItems) {
    resultItems = "No results found";
    return;
  }
  const firstResult = resultItems[num];
  const ResultEmbed = new MessageEmbed();
  ResultEmbed.setTitle(firstResult.title!);
  ResultEmbed.setURL(firstResult.link!);
  ResultEmbed.setDescription(firstResult.snippet!);
  ResultEmbed.setThumbnail(firstResult.pagemap?.cse_thumbnail?.[num]?.src);

  return ResultEmbed

}
