//THIS COMMAND MODULE IS ONLY TO REGISTER THIS COMMAND. WORKLOAD WILL BE HANDLED BY THE PYTHON SCRIPT (POMPY)
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

//Setting up the command to match the specific command on the Python module
export const instagram: CommandInt = {
    
    /* PYTHON EXCERPT:
    
    
    )*/
    data: new SlashCommandBuilder()
    .setName("instagram")
    .setDescription("Fetch posts from an Instagram account")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Username of the account")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of posts you want to fetch")
        .setRequired(true)),
    
    run: async (interaction) => {

        //DO NOT ADD CODE TO THIS. LEAVE IT AS IT IS

        
        console.log("This interaction will be handled by the Python module pompy.\n Passed over to slashcontrol.py at /home/ubuntu/pompy/bot/cogs/slashcontrol.py")

      },

};
