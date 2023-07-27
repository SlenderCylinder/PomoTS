//THIS COMMAND MODULE IS ONLY TO REGISTER THIS COMMAND. WORKLOAD WILL BE HANDLED BY THE PYTHON SCRIPT (POMPY)
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

//Setting up the command to match the specific command on the Python module
export const mc_server: CommandInt = {
    
    /* PYTHON EXCERPT:

    )*/
    data: new SlashCommandBuilder()
    .setName("mc_server")
    .setDescription("Fetch Minecraft server status.")
    .addStringOption(option => option.setName('type').setDescription('Specify game type').setRequired(true)
    .addChoices(
      { name: 'Java', value: '1' },
      { name: 'Bedrock', value: '2' },
    ))
    .addStringOption(option => option.setName('server_ip').setDescription('IP address of the server').setRequired(false)
    ),
    run: async (interaction) => {

        //DO NOT ADD CODE TO THIS. LEAVE IT AS IT IS

        
        console.log("mc_server_slash_cmd: this interaction will be handled by the Python module pompy.\n Passed over to slashcontrol.py at /home/ubuntu/pompy/bot/cogs/slashcontrol.py")

      },

};
