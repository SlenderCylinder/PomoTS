import { Client, Intents, Message, MessageButton } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { IntentOptions } from "./config/IntentOptions";
import { connectDatabase } from "./database/connectDatabase";
import { validateEnv } from "./utils/validateEnv";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";
import { resultsEmbed, res_num } from "./commands/google";
import { row, resource, player, connection, NPMessageID, URL, fastForward, rewind } from "./commands/youtube";
//import { reminders, remind_user } from "./commands/reminder";


async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const BOT = new Client({ intents: IntentOptions });

(async () => {
  if (!validateEnv()) return;

  BOT.on("ready", async () => await onReady(BOT));
  BOT.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction)
  );
  await connectDatabase();
  await BOT.login(process.env.BOT_TOKEN);

  let num: number = 1;
  let iter: number = 2;
  const maxResults: number = 9;
  let isPaused = false;

  BOT.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "next") {
        console.log("Next button pressed");
        if (num >= maxResults) {
          await interaction.update({
            content: "Only 10 results are generated",
          });
          return;
        }
        const nextResultEmbed = resultsEmbed(num);
        console.log("Iteration: " + (iter));
        if (!nextResultEmbed) {
          return;
        }
        await interaction.update({
          content: "Result: " + (iter),
          embeds: [nextResultEmbed],
        });
        num += 1;
        iter += 1;
      } else if (interaction.customId === "back") {
        console.log("Back button pressed");
        if (num <= 0) {
          await interaction.update({
            content: "Can only go forward from here",
          });
          return;
        }
        const nextResultEmbed = resultsEmbed(num);
        console.log("Iteration: " + (num - 1));
        if (!nextResultEmbed) {
          return;
        }
        await interaction.update({
          content: "Result: " + (iter - 1),
          embeds: [nextResultEmbed],
        });
        num -= 1;
        iter -= 1;
      }
    }
  });


  BOT.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "stop") {
        await interaction.update("Stopping...")
        connection.destroy();
        interaction.editReply({ content: `Ended playback:\n${URL}`});
      }
    if (interaction.customId === "pause" || interaction.customId === "resume") {

      player.on('stateChange', (oldState, newState) => {
        if (newState.status === AudioPlayerStatus.Paused) {
          isPaused = true;
        }
        if (newState.status === AudioPlayerStatus.Playing) {
          isPaused = false;
        }
      });
      if (!isPaused) { 
        player.pause();
        delay(3000)
        const pauseButton = row.components.find(button => button.customId === 'pause') as MessageButton;
        pauseButton.setLabel('Resume')
        pauseButton.setCustomId('resume');

        interaction.update({ content: `⏸️ Paused playback:\n${URL}`, components: [row]});

      } else {
        player.unpause();
        delay(3000)
        const resumeButton = row.components.find(button => button.customId === 'resume') as MessageButton;
        resumeButton.setLabel('Pause'); 
        resumeButton.setCustomId('pause');
        interaction.update({ content: `▶️ Now Playing:\n${URL}`, components: [row]});
  
      }
      
    }


    /*if (interaction.isButton()) {
      console.log(NPMessageID)
      if (interaction.customId === "fast-forward") {
        fastForward();
        await interaction.update({ components: [row] });
      }
    }*/
         
  }
 // check every minute
  
});
})();
