import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import { exec } from 'child_process';
import { MessageEmbed } from "discord.js";

//const TWITTER_API_ENDPOINT = 'https://api.twitter.com/1.1/search/tweets.json';
//const CONSUMER_KEY = 'mb9GLwerfBvE6ISYI5opvbhft';
//const CONSUMER_SECRET = '5gSV2cIywcV11M3MWZ2ZvjGL1kkTH0RYURvWvnH3osnahrzG4G';
//const ACCESS_TOKEN = 'vxxfQLTrIdrNuSa6hTcPQzfgX (API KEY)';
//const ACCESS_TOKEN_SECRET = 'mkcV4WV0RSrIo1p0TDr2wSFFY0e4pAzZnkprP5H9XIAAir9amS (API KEY SCRET)';
//const TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAG9gmgEAAAAAD9ZI2liksJDvHMFC8mzv%2FoPFPPw%3Db1m3APslf9WTCkfQh2fVRUQlE7ZzSZpMWh9jyDpwjCObujHmwq';

export const year_progress: CommandInt = {
  // Define the data for the slash command
  data: new SlashCommandBuilder()
      .setName("year_progress")
      .setDescription("Shows how much of this year is completed as a nifty percentage bar"),

  // Define the function that runs when the command is used
  run: async (interaction) => {
      await interaction.deferReply(); // Let Discord know that the bot is working on a response

      exec('python3 yearprogress_xtract.py', (error, stdout, stderr) => {
          // If there's an error or stderr output, log it and send an error message to the channel
          if (error || stderr) {
              console.error(`Error: ${error || stderr}`);
              interaction.editReply(error?.message || stderr || 'An error occurred while fetching data.');
              return;
          }

          // Convert the output of the Python script to a string
          const progressMatch = stdout.match(/\d+%/) || []; // Find the progress percentage using a regular expression
          const progress = progressMatch[0]?.toString(); // Convert the progress percentage to a string
          const urlMatch = stdout.match(/http(s?):\/\/[^\s]+/) || []; // Find the URL using a regular expression
          const url = urlMatch[0]?.toString(); // Convert the URL to a string

          // If the progress percentage or URL can't be found, don't do anything
          if (!progress || !url) {
              return;
          }

          // Create a new embed to display the progress percentage and an image
          const embed = new MessageEmbed()
              .setTitle(`2023 is ${progress} complete`)
              .setDescription(`Currently in Q2.`)
              .setImage(url)
              .setColor('#0099ff')
              .setTimestamp();

          // Send the progress percentage and the embed to the channel
          interaction.editReply({ embeds: [embed] });
      });
  },
};


