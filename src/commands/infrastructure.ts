//THIS COMMAND MODULE IS ONLY TO REGISTER THIS COMMAND. WORKLOAD WILL BE HANDLED BY THE PYTHON SCRIPT (POMPY)
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

//Setting up the command to match the specific command on the Python module
export const infrastructure: CommandInt = {
    
    /* PYTHON EXCERPT:

    )*/
    data: new SlashCommandBuilder()
    .setName("infrastructure")
    .setDescription("Fetch VM information.")
    .addStringOption(option => option.setName('option').setDescription('Select VM instance (Pomoji core code is in Ubuntu VM').setRequired(true)
    .addChoices(
      { name: 'Ubuntu Ampere', value: '1' },
      { name: 'RHEL 9 aarch64', value: '2' },
    )),
    run: async (interaction) => {

        //DO NOT ADD CODE TO THIS. LEAVE IT AS IT IS

        
        console.log("infrastructure_slash_cmd: this interaction will be handled by the Python module pompy.\n Passed over to slashcontrol.py at /home/ubuntu/pompy/bot/cogs/slashcontrol.py")

      },

};
