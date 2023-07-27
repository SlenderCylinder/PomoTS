import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

export const timeuntil: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("timeuntil")
    .setDescription("Calculate duration between two dates")
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Specify a date/time (eg. 06/30/2027 12:35)")
        .setRequired(true)
    ),
    run: async (interaction) => {
        const user = interaction.user;
        await interaction.deferReply();
        console.log(`/timeuntil: executed by ${user.tag}`);

        const inputDate = interaction.options.getString('date') || " ";
        const targetDate = parseDateTime(inputDate);


        const timezoneStatenIsland = 'America/New_York';
        const timezoneColombo = 'Asia/Colombo';
        var timezone: any 

        if (user.id = "490687063692279818"){

            timezone = timezoneColombo

        }
        else if (user.id = "694679380068270170"){

            timezone = timezoneStatenIsland
        };



          
        if (targetDate !== null) {
            const timeUntil = getTimeUntil(targetDate, timezone);
            await interaction.editReply(timeUntil)

        } else {
            await interaction.editReply(`I couldn't parse that date`);
        };
        
        console.log(`/timeuntil: Finished executing.`);

      },

};

function getTimeUntil(date: Date, timezone: string): string {
    const now = new Date().toLocaleString('en-US', { timeZone: timezone });
    const currentDateTime = new Date(now);
    const difference =  date.getTime() - currentDateTime.getTime();
  
    if (difference < 0) {
      return 'The specified date has already passed.';
    }
  
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    const timeString = `${days} days, ${hours % 24} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`;
  
    return `Time until ${date.toLocaleString()}:\n${timeString} (${timezone})`;
}

function parseDateTime(dateTimeString: string): Date | null {
    const dateTimeRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/;
    const matches = dateTimeString.match(dateTimeRegex);
  
    if (!matches) {
      return null;
    }
  
    const month = parseInt(matches[1], 10);
    const day = parseInt(matches[2], 10);
    const year = parseInt(matches[3], 10);
    const hours = parseInt(matches[4], 10);
    const minutes = parseInt(matches[5], 10);
    const seconds = matches[6] ? parseInt(matches[6], 10) : 0;
  
    return new Date(year, month-1, day, hours, minutes, seconds);
}
  
  /* Example usage:
  const dateTimeString1 = '06/15/2023 10:30:45';
  const dateTimeString2 = '7/1/2023 2:45';
  const dateTimeString3 = '22/12/2023 08:00:15';
  const dateTimeString4 = '1/5/2023 4:30';
  const dateTimeString5 = '06/15/23 09:00:20';
  const dateTimeString6 = '7/1/23 1:15';
  
  const dateTime1 = parseDateTime(dateTimeString1);
  const dateTime2 = parseDateTime(dateTimeString2);
  const dateTime3 = parseDateTime(dateTimeString3);
  const dateTime4 = parseDateTime(dateTimeString4);
  const dateTime5 = parseDateTime(dateTimeString5);
  const dateTime6 = parseDateTime(dateTimeString6);
  
  console.log(dateTime1);
  console.log(dateTime2);
  console.log(dateTime3);
  console.log(dateTime4);
  console.log(dateTime5);
  console.log(dateTime6); */