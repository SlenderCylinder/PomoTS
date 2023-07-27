//THIS COMMAND MODULE IS ONLY TO REGISTER THIS COMMAND. WORKLOAD WILL BE HANDLED BY THE PYTHON SCRIPT (POMPY)
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

//Setting up the command to match the specific command on the Python module
export const steam_user: CommandInt = {
    
    /* PYTHON EXCERPT:

    )*/
    data: new SlashCommandBuilder()
    .setName("steam_user")
    .setDescription("Get information about a Steam account.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Username or User ID")
        .setRequired(true)
    ),
    run: async (interaction) => {
        const user = interaction.user.tag;
        console.log(`/steam_user: executed by ${user}`)
        //DO NOT ADD CODE TO THIS. LEAVE IT AS IT IS

        
        console.log("/steam_user: REFERRED_POMPY_PM0\n/steam_user: this interaction will be handled by the Python module pompy.\n||  See slashcontrol.py at /home/ubuntu/pompy/bot/cogs/slashcontrol.py ||")

      },

};
