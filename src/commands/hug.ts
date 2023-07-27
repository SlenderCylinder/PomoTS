import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import {MessageEmbed} from "discord.js";

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export const hug: CommandInt = {
    data: new SlashCommandBuilder()
      .setName("hug")
      .setDescription("Hug the specified user")
      .addUserOption((option) => option.setName('user').setDescription('User to hug').setRequired(true))
      .addStringOption((option) =>option.setName("message").setDescription('The message you want to send them').setRequired(true)),
    run: async (interaction) => {
      await interaction.deferReply();
      const user = interaction.user;
      const text = interaction.options.getString("message", true);
      const target = interaction.options.getUser('user');

      const boopEmbed = new MessageEmbed();
      console.log(user.id)
      console.log(target?.id)
      console.log(`${user.username} used hug command on ${target?.username}`)

      if (user.id == "694679380068270170" && target?.id !== user.id){
        boopEmbed.setTitle(`Chamith, you've been hugged tightly by Joanna`);
        boopEmbed.setImage('https://media.tenor.com/967PJHzoZlIAAAAC/milk-and-mocha-hug.gif')
      }
      else if (target?.id == "694679380068270170" && target?.id !== user.id){
        boopEmbed.setTitle(`Joanna, you've been hugged tightly by Chamith`);
        boopEmbed.setImage('https://media.tenor.com/lkNKovmAZNwAAAAC/milkmocha-milkmocha-hug.gif')
        
      }
      else if (target?.id == user.id){
        boopEmbed.setTitle(`You hugged yourself. That's kind of sad`);
      }
      else{
        boopEmbed.setTitle(`${target?.username}, you've been hugged by ${user.username}`);
      };
      
      boopEmbed.setDescription(text);
      boopEmbed.setAuthor({name: user.tag, iconURL: user.displayAvatarURL(),
      });
      //boopEmbed.addFields({ name: 'Boop text', value: text});//

      await interaction.editReply({content:`<@${target?.id}>`, embeds: [boopEmbed]});
    },
  };