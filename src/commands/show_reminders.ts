import { SlashCommandBuilder, range } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import { queue } from "./reminder";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import moment from 'moment-timezone';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const show_reminders: CommandInt = {
  // Define the data for the slash command
  data: new SlashCommandBuilder()
      .setName("show_reminders")
      .setDescription("Shows all the reminders you have logged with Pomoji.")
      .addStringOption(option => option.setName('status').setDescription('Select the type of reminders you want to view').setRequired(true)
      .addChoices(
        { name: 'pending', value: 'pending' },
        { name: 'completed', value: 'completed' },
      ))
      ,

  // Define the function that runs when the command is used
  run: async (interaction) => {

    const status = interaction.options.getString('status')


    const interactingUserId = interaction.user.id;
    
    if (!interaction.guild){console.log("No server ID found"); return;}

    const serverId = interaction.guild.id;
    const server = interaction.client.guilds.cache.get(serverId);
    const member = server?.members.cache.get(interactingUserId);

    console.log(`show_reminder slash command executed on server ${server} by ${member}`)

    if (!member) {
      return interaction.reply('User not found on this server.');
    }
  
    const nickname = member.nickname || member.user.username;




    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('delete')
        .setLabel('Delete reminder')
        .setStyle('DANGER'),
      new MessageButton()
        .setCustomId('edit')
        .setLabel('Stop')
        .setStyle('PRIMARY'),
    );

    if(!status){return;}

    let { jobMap, jobList} = await getReminders(status, interactingUserId,  nickname);

      
    const jobListEmbed = new MessageEmbed()
    .setColor("#7cc5b5")
    .setTitle(`Your ${status} reminders, ${nickname}:`)
    .setDescription(jobList);


    interaction.reply({embeds: [jobListEmbed], components: [row]});


    const filter = (buttonInteraction:any) => buttonInteraction.customId === "delete";
    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      time: 10000, // Time limit in ms, after which the collector will automatically stop
    });

    collector?.on("collect", async (buttonInteraction) => {
      // Respond to button press

      await buttonInteraction.reply({content: 'Which reminder do you want to delete (enter a number or range; eg. 1, 1 - 5, 3):',  ephemeral: true});
          
      const filter = () => true;
      const delNumcollector = interaction.channel?.createMessageCollector({
        filter,
        max: 1,
        time: 60000, // 10 seconds
      });

      delNumcollector?.on('collect', (m) => {
        // Do something with the collected message
        m.delete();
      });
      
    
      delNumcollector?.on('end', async (collected) => {


        const reminderList = jobList
        const reminders = reminderList.split("\n"); // Step 1 
        const lines = jobList.split('\n');
        const response = collected.first()?.content ?? 'No response';
    
        await interaction.editReply(`You entered: ${response}`);
    
        const rangeRegex = /^(\d+)-(\d+)$/;
        const rangeMatch = response.match(rangeRegex);
    
        if (rangeMatch) {
            const start = Number(rangeMatch[1]);
            const end = Number(rangeMatch[2])
    
            for (let i = start; i <= end; i++) {
                const jobIdToDelete = jobMap[i];
                if (jobIdToDelete) {
                    console.log(`Deleting ${i} with jobID ${jobIdToDelete}`);
                    delete jobMap[i];
                    queue.getJob(jobIdToDelete).then(function(job) { return job!.remove(); })
                    console.log("Deleted");
                } else {
                    await interaction.editReply(`${i} has already been deleted`);
                }

            }

            console.log(jobList)
            
                          
            const jobListEmbedv2 = new MessageEmbed()
            .setColor("#7cc5b5")
            .setTitle(`Your ${status} reminders, ${nickname}:`)
            .setDescription(jobList);
     
            await interaction.editReply({content:`Deleted jobs ${start}-${end}. Updated list:`, embeds:[jobListEmbedv2]});
    
        } else {
            const index = Number(response);
            const jobIdToDelete = jobMap[index];
    
            if (!jobIdToDelete) {
                await interaction.editReply(`${response} has already been deleted. No changes made`);
            } else {
                console.log(`Deleting ${response} with jobID ${jobIdToDelete}`);
                delete jobMap[index];
                queue.getJob(jobIdToDelete).then(function(job) { return job!.remove(); });
                delay(4000);
                const { jobMapv3, jobList } = await getReminders(status, interactingUserId, nickname);

                                
                const jobListEmbedv3 = new MessageEmbed()
                .setColor("#7cc5b5")
                .setTitle(`Your ${status} reminders, ${nickname}:`)
                .setDescription(jobList);

                await interaction.editReply({content:`Deleted job number ${response}. Updated list: `, embeds: [jobListEmbedv3]});

                console.log("Deleted");
                
            }
        }

    });

});


async function getReminders(status:String, interactingUserId:string, nickname:string):Promise<any> {
  let jobs, tense;

  if (status === 'pending') {
    jobs = await queue.getJobs(['delayed']);
    tense = 'will run';

  } else if (status === 'completed') {
    jobs = await queue.getCompleted();
    tense = 'ran';
  } else {
    return { jobMap: null, jobList: null, jobListEmbed: null };
  }

  console.log(`Fetching jobs...`);
  const filteredJobs = jobs.filter(job => {
    const jobData = job.data;
    console.log(`JOB_ID#${job.id}: ${jobData.message}`);
    const userId = jobData.user_id;
    return userId.id === interactingUserId;
  });
  console.log(`Fetched.`);

  const jobListArray = [];
  let userId;
  let num = 1;
  const jobMap: { [key: number]: string } = {};

  for (const job of filteredJobs) {
    const jobData = job.data;
    const message = jobData.message;
    userId = jobData.user_id;
    jobMap[num] = job.id.toString(); // Add the mapping to the object
    const scheduledTime = moment(job.timestamp).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    if (!job.opts.delay){return;}
    const runTime = moment(job.timestamp + job.opts.delay).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');      
    jobListArray.push(`${num}) On ${scheduledTime} you added a reminder: __*${message}*__; that ${tense} at **${runTime}**\n`);
    num += 1;
  }
  
  if (jobListArray.length === 0) {
    console.log("Job list is empty");
    return { jobMap: null, jobList: "There are no reminders pending", jobListEmbed: null };
  }

  const jobList = jobListArray.join('\n');

  console.log(jobList);
  console.log(jobMap);

  return { jobMap, jobList};
   }
  }
};



  /*run only when you need jobs to be deleted
  for (let i = 14; i >= 0; i--) {
    const jobToDelete = i.toString();
    queue.getJob(jobToDelete).then(job => {
      if (job) {
        job.remove().then(() => {
          console.log(`Job ${jobToDelete} was removed successfully`)
          // Update user's reminder list
          // ...
        });
      } else {
        console.log(`Job ${jobToDelete} not found`)
        // Handle error
      }
    }).catch(error => {
      console.log(error)
    }); 
  }*/