import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import { Instagrapi, TPost, TComment } from 'instagrapi'
import axios from 'axios';
import * as fs from 'fs';
import {getCamperData} from "../modules/getCamperData";
import {updateCamperData} from "../modules/updateCamperData";
import {MessageEmbed} from "discord.js";


export const test: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("FOR TESTING PURPOSES; DO NOT USE")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("username")
        .setRequired(true)
    ),
    run: async (interaction) => {
        await interaction.deferReply();
        const comments = await getFollowers()
        console.log(comments)
        await interaction.editReply("Comments sent");
      },

};

async function getComments(): Promise<string[] | undefined> {
    const instagrapi = new Instagrapi({
        sessionId: '59611882650%3Ap1gZSdW0RjFt7q%3A18%3AAYe_v0ElNrbpwXcH1QWk_Z6wTwLJgygUkcQyWdZdew'
      })

    try {
      const post: TPost = await instagrapi.getPost('https://www.instagram.com/p/B-mPlB6JwZh/')
      const comments: string[] = post.previewComments.map((comment: TComment) => comment.content)
  
      console.log(comments) // Preview comments of the post
  
      return comments
    } catch (error) {
      console.error(error)
    }
  }

async function getFollowers(): Promise<string | undefined> {
    let followers:any;
    const instagrapi = new Instagrapi({
        sessionId: '59611882650%3Ap1gZSdW0RjFt7q%3A18%3AAYe_v0ElNrbpwXcH1QWk_Z6wTwLJgygUkcQyWdZdew'
      })
      instagrapi.getProfile('markmanson').then(profile => {
        console.log(profile.followers)
        followers = profile.followers // Numbers followers of instagram account
      })
    return followers;
}