import { Client } from "discord.js";
import {REST} from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { CommandList } from "../commands/_CommandList";


export const onReady = async (BOT: Client) => {
    const rest = new REST({ version: "9" }).setToken(
        process.env.BOT_TOKEN as string
      );
    
  const commandData = CommandList.map((command) => command.data.toJSON());

  await rest.put(
    Routes.applicationCommands(
      BOT.user?.id || "missing id",
    ),
    { body: commandData }
  );

  BOT.on('guildCreate', async (guild) => {
    guild.commands.set(commandData).then(() => 
    console.log(`Commands deployed in guild ${guild.name}!`));
    }) // Check every 5 seconds

  console.log("Discord ready!");

};
