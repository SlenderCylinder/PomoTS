//THIS COMMAND MODULE IS ONLY TO REGISTER THIS COMMAND. WORKLOAD WILL BE HANDLED BY THE PYTHON SCRIPT (POMPY)
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

//Setting up the command to match the specific command on the Python module
export const serverinfo: CommandInt = {
    
    /* PYTHON EXCERPT:

    )*/
    data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Display information about the Discord server you're in")
    .addStringOption(option => option.setName('about').setDescription('Select sub-information category').setRequired(false)
    .addChoices(
      { name: 'text channels', value: '1' },
      { name: 'categories', value: '2' },
    )),
    run: async (interaction) => {
        const user = interaction.user.tag;
        console.log(`/serverinfo: executed by ${user}`)
        //DO NOT ADD CODE TO THIS. LEAVE IT AS IT IS
        console.log(`/serverinfo: REFERRED_POMPY_PM0\n/serverinfo: This interaction will be handled by the Python module pompy.\n|| See slashcontrol.py at /home/ubuntu/pompy/bot/cogs/slashcontrol.py ||`)

      },

};
