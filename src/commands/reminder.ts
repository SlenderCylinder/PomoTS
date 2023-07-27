import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import { MessageEmbed } from "discord.js";
import Bull, { Job } from 'bull';
const redis = require("redis");
import { BOT } from '../index';
//import moment from 'moment-timezone';
//import { WebhookClient, TextChannel } from "discord.js";

console.log("/reminder: Connecting to Redis server....")
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});
console.log("/reminder: Done.\nRedis server up and running at 127.0.0.1:6379")

console.log("/reminder: Initiating Bull...")
export const queue = new Bull('reminders', { redis: redisClient });
console.log("/reminder: Bull up and running")


queue.process(async (job: Job<{ message: string; user_id:any  }>) => {
  const { message, user_id } = job.data;
  const user = await BOT.users.fetch(user_id.id);
  /*const reminderEmbed = new MessageEmbed()
    .setTitle(`Reminder:`)
    .setDescription(`> ${message}`)
    .setColor("#d89b1d")*/
  try {
    console.log(`/reminder: Sending reminder to ${remind_user} in DMs...`)
    await user.send(`Reminder: ${message}`);
    console.log("/reminder: Sent")
  } catch (error) {
    console.log(`/reminder: Failed to send reminder to user ${user.tag}: ${error}`);
  }
});

export let remind_user:any;

export const reminder: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Create a reminder")
    .addStringOption((option) => option.setName('time').setDescription('When do you want to be reminded (eg. 10h 20m; 40h 20m; 10m; 50s)?').setRequired(true))
    .addStringOption((option) =>option.setName('reminder').setDescription('What do you want to be reminded about?').setRequired(true)),
  run: async (interaction) => {

    console.log(`/reminder: executed by ${interaction.user.tag}`)

    remind_user = interaction.user;
    const timeString = interaction.options.getString("time", true);
    const reminder_text = interaction.options.getString('reminder')?.toString();

    //const userTimezone = getUserTimezone(message.author.id);
    //const serverTimezone = moment.tz.guess();
    //const serverScheduledTime = scheduledTime.tz(serverTimezone);

    const timeUnits = timeString.match(/\d+[dhms]/g);
    if (!timeUnits || timeUnits.length === 0) {
      interaction.reply('Invalid time format. Please enter a valid time format (e.g. 10s, 20m, 2h 30m).');
      return;
    }

    if (!reminder_text){ return; }

    let timeMs = 0;
    let timeText = "";

    console.log(`/reminder: User input received from ${remind_user.username} [time: ${timeString}; reminder: ${reminder_text}]`)

    for (const timeUnit of timeUnits) {
        const timeValue = parseInt(timeUnit.substring(0, timeUnit.length - 1));
        const unit = timeUnit.charAt(timeUnit.length - 1).toLowerCase();
  
        switch (unit) {
          case 's':
            timeMs += timeValue * 1000;
            timeText += `${timeValue} second${timeValue > 1 ? 's' : ''} `;
            break;
          case 'm':
            timeMs += timeValue * 1000 * 60;
            timeText += `${timeValue} minute${timeValue > 1 ? 's' : ''} `;
            break;
          case 'h':
            timeMs += timeValue * 1000 * 60 * 60;
            timeText += `${timeValue} hour${timeValue > 1 ? 's' : ''} `;
            break;
          case 'd':
            timeMs += timeValue * 1000 * 60 * 60 * 24;
            timeText += `${timeValue} day${timeValue > 1 ? 's' : ''} `;
            break;
          default:
            interaction.reply(`Invalid time unit '${unit}'. Please enter a valid time unit (s, m, h, or d).`);
            return;
        }
      }

    try {
      await queue.add({ message: reminder_text || '', user_id: remind_user}, { delay: timeMs });
      console.log("/reminder: Reminder queued: bull => redis")
    } catch (error) {
      console.log(`/reminder: Failed to add reminder to queue: ${error}`);
      interaction.reply("Failed to add reminder to queue. Please try again later.");
      return;
    }
    const unixTimestamp = Math.floor((timeMs + Date.now())/ 1000);
    //const date = new Date(unixTimestamp * 1000);
    const formattedTime = `<t:${unixTimestamp}:T>`;

    const reminderEmbedInit = new MessageEmbed()
    .setTitle(`Reminder:`)
    .setDescription(`> ${reminder_text}`)
    .setColor("#d89b1d")
    .addFields(
      {
        name: "You will be reminded in",
        value: `${timeText.trim()} (${formattedTime})`,
        inline: true
      })
    interaction.reply({embeds:[reminderEmbedInit]})
    console.log(`/reminder: Reminder stored in database.`)
    console.log(`/reminder: Finished executing.`)

  },
};
