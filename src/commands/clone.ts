import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import { WebhookClient, TextChannel } from "discord.js";
import sharp from 'sharp';
//import axios from 'axios';
//import fs from 'fs';
//auth = tweepy.AppAuthHandler('5QXSvbL0LksCGGoKydYv3lu8p', ‘T5hQRhBpv1P8Cqv3Hp1352T9gduVBuqDucyZ75yOyZxGCbltO9')‍

export const clone: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("clone")
    .setDescription("Clone a user and send a message as them")
    .addUserOption((option) => option.setName('user').setDescription('User to clone').setRequired(true))
    .addStringOption((option) =>option.setName('message').setDescription('Message you want to say as them').setRequired(true)),
  run: async (interaction) => {
    const { user, member } = interaction;
    const message = interaction.options.getString("message", true);
    const target = interaction.options.getUser('user');


    await interaction.deferReply({ephemeral: true});
    if (!(interaction.channel instanceof TextChannel)) {
      return;
    }

    if (!target) {
      console.log("Target user does not exist")
      return;
    }

    var avatarURL = target.avatarURL();
      if (!avatarURL) {
        console.log("No avatar found. Using the default avatar")
        avatarURL = target.defaultAvatarURL.toString();
      }

    const targetMember = interaction.guild?.members.cache.get(target.id);
    const username = targetMember?.nickname ?? target.username;

    const webhook = await interaction.channel.createWebhook(username, { avatar:avatarURL});
    if (!webhook.token) {
      return;
    }
    const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });

    console.log(`Webhook created with the URL: ${webhook.url}`)


    webhookClient.send({
      content: message,
    });

    interaction.editReply({
      content: `Clone created`});
    
    webhook.delete()
    console.log(`Webhook deleted`)
  },
};
/*async function convertToWebp(pngFilePath: string): Promise<string> {
  const buffer = await sharp(pngFilePath).webp().toBuffer();
  const webpUrl = `data:image/webp;base64,${buffer.toString('base64')}`;
  return webpUrl;
}*/

/*async function downloadImage(url: string, filePath: string): Promise<void> {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(fs.createWriteStream(filePath));

  return new Promise((resolve, reject) => {
    response.data.on('end', resolve);
    response.data.on('error', reject);
  });
}*/