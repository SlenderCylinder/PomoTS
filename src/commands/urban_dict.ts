import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import { exec } from 'child_process';
import { MessageEmbed } from "discord.js";


export const urban_dict: CommandInt = {
  // Define the data for the slash command
  data: new SlashCommandBuilder()
      .setName("urban_dict")
      .setDescription("Fetch the meaning of term from Urban Dictonary")
      .addStringOption((option) =>
      option
        .setName("term")
        .setDescription("Term you want to look up")
        .setRequired(true)
        ),
  // Define the function that runs when the command is used
  run: async (interaction) => {
      await interaction.deferReply(); // Let Discord know that the bot is working on a response

      const user = interaction.user.tag
      const query = interaction.options.getString("term", true);
      console.log(`/urban_dict: Executed by ${user} with the query "${query}"`)
      const sanitizedQuery = query.replace(/\s+/g, '_');
      console.log('/urban_dict: Running python script urban_dict.py')
      exec(`python3 urban_dict.py ${query}`, (error, stdout, stderr) => {
          // If there's an error or stderr output, log it and send an error message to the channel
          if (error || stderr) {
              console.error(`Error: ${error || stderr}`);
              interaction.editReply({
                content: `No results found for term: [${query}](${sanitizedQuery})`,
                allowedMentions: {
                    parse: ["users"]
                }
            });
              return;
          }
           
          console.log('/urban_dict: Parsing received output')
          // Convert the output of the Python script to a string
          const [definition, examples, thumbs_up, thumbs_down] = stdout.split('|').map(str => str.trim());
          console.log('/urban_dict: Filling in Discord embed')
          const urbdictEmbed = new MessageEmbed()
          .setTitle(`Definition of ${query}:`)
          .setURL(`https://www.urbandictionary.com/define.php?term=${sanitizedQuery}"`)
          .setDescription(definition)
          .addFields(
            {
              name: "Examples(s)",
              value: examples,
              inline: true
            },
            {
              name: " ",
              value: " ",
              inline: false
            },
            {
              name: "👍",
              value: thumbs_up,
              inline: true
            },
            {
              name: "👎",
              value: thumbs_down,
              inline: true
            })
          .setColor("#00b0f4")
          .setTimestamp()
          .setFooter({
            text: "Urban Dictionary",
            iconURL: "https://play-lh.googleusercontent.com/unQjigibyJQvru9rcCOX7UCqyByuf5-h_tLpA-9fYH93uqrRAnZ0J2IummiejMMhi5Ch=w240-h480",
          });
          console.log('/urban_dict: Sent to Discord')
          interaction.editReply({embeds: [urbdictEmbed]});
          console.log('/urban_dict: Finished executing.')
      });
  },
};