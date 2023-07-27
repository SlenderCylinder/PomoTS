//THIS COMMAND MODULE IS ONLY TO REGISTER THIS COMMAND. WORKLOAD WILL BE HANDLED BY THE PYTHON SCRIPT (POMPY)
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

//Setting up the command to match the specific command on the Python module
export const quran: CommandInt = {
    
    /* PYTHON EXCERPT:

    )*/
    data: new SlashCommandBuilder()
    .setName("quran")
    .setDescription("Get quran verses.")
    .addStringOption((option) =>
      option
        .setName("ref")
        .setDescription("The verse(s) to fetch, e.g. 1:1, 2:255, 1:1-7, 2:255-260")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("translation_key")
        .setDescription("Translation source you want to use. e.g. khattab (default)")
        .setRequired(true)),
    run: async (interaction) => {

        //DO NOT ADD CODE TO THIS. LEAVE IT AS IT IS

        
        console.log("quran_slash_cmd: this interaction will be handled by the Python module pompy.\n Passed over to slashcontrol.py at /home/ubuntu/pompy/bot/cogs/slashcontrol.py")

      },

};
