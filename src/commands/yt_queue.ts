import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

export let linksArray:any;

export const yt_queue: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("yt_queue")
    .setDescription("Add more videos to the active Youtube player")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Link(s) to the video(s). Multiple links must be separated by commas")
        .setRequired(true)
    ),
  run: async (interaction) => {

    interaction.deferReply();

    const YOUTUBE_VIDEO_URLS = interaction.options.getString("link", true);
    linksArray = YOUTUBE_VIDEO_URLS.split(',');
    console.log(linksArray);
    interaction.reply(linksArray)


  }

}