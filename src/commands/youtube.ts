import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import { MessageButton, MessageActionRow, MessageEmbed} from "discord.js";
import { Collection, VoiceChannel} from 'discord.js';
import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus, createAudioResource, DiscordGatewayAdapterCreator } from '@discordjs/voice';
//import ytdl from 'ytdl-core';
import play from 'play-dl';
import fs from 'fs';



//delay function if needed
async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

export let connection: VoiceConnection;
export let player: AudioPlayer;
export let row: MessageActionRow;
export let NPMessageID: any;
export let resource:any;
export let currentTime = 0;
export let linksArray:any;
export let URL:string
export let queueEmbed:any;

export const youtube: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("youtube")
    .setDescription("Play a Youtube video in VC")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Link to the video")
        .setRequired(true)
    ),
  run: async (interaction) => {
    await interaction.deferReply();

    row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('pause')
            .setLabel('Pause')
            .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('stop')
          .setLabel('Stop')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('fast-forward')
          .setLabel('Fast Forward')
          .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('rewind')
        .setLabel('Rewind')
        .setStyle('PRIMARY')
          );
    const YOUTUBE_VIDEO_URLS = interaction.options.getString("link", true);
    linksArray = YOUTUBE_VIDEO_URLS.split(',');
    console.log(linksArray);

    queueEmbed = new MessageEmbed()
    .setTitle("Queue")
    .setDescription(linksArray.join("\n"))

    await interaction.editReply("Starting playback...");

    const guild = interaction.guild;
    if (!guild){return};
    const channels = guild.channels.cache;
  
  // Get the voice channel names and IDs
    const voiceChannels = channels.filter(channel => channel.type === 'GUILD_VOICE' && channel instanceof VoiceChannel ) as Collection<string, VoiceChannel>;
    const voiceChannelsArray = Array.from(voiceChannels.values());
    const voiceChannelNames = voiceChannelsArray.map(channel => channel.name);

  // Cast the channel to a VoiceChannel object
    let voiceChannel = channels.find(
      (channel) =>
        channel.type === "GUILD_VOICE" && channel.name.toLowerCase() === "general"
    ) as VoiceChannel; 
    // Check if the voice channel exists

    if (!voiceChannel) {
      console.log("No voice channel found.");
      return;
    }

    try {

      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        selfDeaf: false
      });



    async function audioPlayer(URL:string){

          let stream = await play.stream(URL);
          const videoInfo = await play.video_info(URL);
          const durationInSec = videoInfo.video_details.durationInSec;
          console.log(durationInSec);
          /*const videoInfoJson = JSON.stringify(videoInfo, null, 2);

          fs.writeFile('video_info.json', videoInfoJson, (err) => {
            if (err) throw err;
            console.log('Video info saved to file.');
          });*/

          resource = createAudioResource(stream.stream, {
            inputType: stream.type
        })

          player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        })

        player.play(resource)
        connection.subscribe(player)

        const NPMessage = await interaction.editReply({ content: `▶️ Now Playing : ${URL}`, components: [row] });
        NPMessageID = NPMessage.id;

        player.on('stateChange', (oldState, newState) => {
          console.log(`Player state changed from ${oldState.status} to ${newState.status}.`);
        });
      //Track state change of the player
        player.on('stateChange', (oldState, newState) => {
          if (newState.status === AudioPlayerStatus.Idle) {
            interaction.editReply({ content: `Finished Playing : ${URL}`});
            
          }
        return;
        });
    }

      await interaction.followUp({ embeds:[queueEmbed] });

      //Track state change of the connection
      connection.on("stateChange", (oldState, newState) => {
        if (
          oldState.status === VoiceConnectionStatus.Ready &&
          newState.status === VoiceConnectionStatus.Connecting
        ) {
          connection.configureNetworking();
        }
        console.log(`Connection state changed from ${oldState.status} to ${newState.status}.`);
      });

        // Play the audio file
        console.log("Playing audio.");
        if (linksArray.length > 0){
          URL = linksArray[0]
          await audioPlayer(URL = URL)
        }
  


  

      player.on('stateChange', (oldState, newState) => {
        if (newState.status === AudioPlayerStatus.Idle) {
          if (linksArray.length === 0) {
            return;
          }
          let removed = linksArray.shift()
          console.log(`Removed link : ${removed}`);
          if (linksArray.length > 0){
            URL = linksArray[0]
            audioPlayer(URL = URL)
          }
          setTimeout(() => {
            if (player.state.status === AudioPlayerStatus.Idle) {
              connection.destroy();
            }
          }, 10000); // 10 seconds
        }
      });
      
    } catch (error) {
      console.error(error);
      //handleConnectionReset();
      delay(5000); // wait 5 seconds before retrying
    }

    // Print all found volice channel IDs and names in the guild
    console.log(`Found voice channels: ${voiceChannelsArray} with names ${voiceChannelNames}`);
  }
};

/*async function handleConnectionReset() {
  while (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
    try {
      connection.subscribe(player);
      player.play(resource);

      console.log("Resumed playback.");
      break;
    } catch (error) {
      console.error(error);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }
}*/
export function fastForward() {
  const currentTime = resource.playStreamTime;
  const newTime = resource.playStreamTime = currentTime + 10000;
  console.log(currentTime)
  console.log(newTime)
}

export function rewind() {
  const currentTime = resource.playStreamTime;
  resource.playStreamTime = currentTime - 10000;
  

}