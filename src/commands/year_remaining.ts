import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import { exec } from 'child_process';

const TWITTER_API_ENDPOINT = 'https://api.twitter.com/1.1/search/tweets.json';
const CONSUMER_KEY = 'mb9GLwerfBvE6ISYI5opvbhft';
const CONSUMER_SECRET = '5gSV2cIywcV11M3MWZ2ZvjGL1kkTH0RYURvWvnH3osnahrzG4G';
const ACCESS_TOKEN = 'vxxfQLTrIdrNuSa6hTcPQzfgX (API KEY)';
const ACCESS_TOKEN_SECRET = 'mkcV4WV0RSrIo1p0TDr2wSFFY0e4pAzZnkprP5H9XIAAir9amS (API KEY SCRET)';
const TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAG9gmgEAAAAAD9ZI2liksJDvHMFC8mzv%2FoPFPPw%3Db1m3APslf9WTCkfQh2fVRUQlE7ZzSZpMWh9jyDpwjCObujHmwq';




export const year_remaining: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("year_remaining")
    .setDescription("Shows how much of this year is remaining as a nifty percentage bar"),
    run: async (interaction) => {
        await interaction.deferReply();

        exec('python3 yearremaining_xtract.py', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            interaction.editReply(error.message);
            return;
          }
          if (stderr) {
            console.error(`Error: ${stderr}`);
            interaction.editReply(stderr);
            return;
          }
          // Store the output of the Python script in a TypeScript variable
          const output: string = stdout;
          console.log(`Tweet fetched from year_progress: ${output}`);
          interaction.editReply(output); // Send the output to Discord channel
        });


    },
};

