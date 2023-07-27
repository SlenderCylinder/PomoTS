import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import {MessageEmbed} from "discord.js";

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export const boop: CommandInt = {
    data: new SlashCommandBuilder()
      .setName("boop")
      .setDescription("Boop the specified user")
      .addUserOption((option) => option.setName('user').setDescription('User to boop').setRequired(true))
      .addStringOption((option) =>option.setName("message").setDescription('The message you want to send them').setRequired(true))
      .addIntegerOption((option) => option.setName('boop_amount').setDescription('How many times do you want to boop the user')),
    run: async (interaction) => {
      await interaction.deferReply();
      const { user } = interaction;
      const text = interaction.options.getString("message", true);
      const target = interaction.options.getUser('user');
      var amount = interaction.options.getInteger('boop_amount');

      if (amount == null){
        amount = 1;
      }

      else if (amount > 10){
        await interaction.followUp({content:`You cannot boop someone more than 10 times at once. Capping to 10`});
        amount = 10;
        await delay(5000)
      }

      if (amount <= 1){
        var counter = 'once';
      }
      else{
        var counter = `${amount} times`;
      }

      const boopEmbed = new MessageEmbed();
      if (target?.id == "490687063692279818" && target?.id !== user.id){
        boopEmbed.setTitle(`Chamith, you've been BOOPed ${counter} by Joanna`);
        boopEmbed.setImage('https://media.tenor.com/CW9zeEa2DksAAAAi/milk-and-mocha-poke.gif')
      }
      if (target?.id == "694679380068270170" && target?.id !== user.id){
        boopEmbed.setTitle(`Joanna, you've been BOOPed ${counter} times by Chamith`);
        boopEmbed.setImage('https://media.tenor.com/1VWcl-qLSpwAAAAC/milk-and-mocha-bears-poke.gif')
      }
      else if (target?.id == user.id){
        boopEmbed.setTitle(`You booped yourself ${counter}, ${user.username}`);
      }
      else{
        boopEmbed.setTitle(`${target?.username}, you've been BOOPed ${counter} by ${user.username}`);
      }
      
      boopEmbed.setDescription(text);
      boopEmbed.setAuthor({name: user.tag, iconURL: user.displayAvatarURL(),
      });
      //boopEmbed.addFields({ name: 'Boop text', value: text});//

      await interaction.editReply({content:`<@${target?.id}>`, embeds: [boopEmbed]});
    },
  };