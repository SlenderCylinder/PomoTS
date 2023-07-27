import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import axios from 'axios';
import cheerio from 'cheerio';
import { MessageEmbed } from "discord.js";

export const uscis: CommandInt = {

    data: new SlashCommandBuilder()
    .setName("uscis")
    .setDescription("Get case status from USCIS.")
    .addStringOption((option) =>
      option
        .setName("case_number")
        .setDescription("If no case number is provided, Case WAC2390058528 will be used by default")
        .setRequired(false)
    ),
    run: async (interaction) => {
        await interaction.deferReply();
        const user = interaction.user.tag;
        console.log(`/uscis: Executed by ${user}`)
        var case_no = interaction.options.getString("case_number", false);
        console.log(case_no)
        if (!case_no){
            case_no = "WAC2390058528"
        }
        try {
            const response = await axios.get(`https://www.casestatusext.com/cases/${case_no}`); // Replace with the actual URL of the page containing the selector
            const html = response.data;
            const $ = cheerio.load(html);
        
            const receipt_no = $('tr.ant-descriptions-row:nth-child(1) > td:nth-child(2) > span:nth-child(1)').text();
            const receipt_block = $('tr.ant-descriptions-row:nth-child(1) > td:nth-child(4) > span:nth-child(1)').text();
            const form_type = $('td.ant-descriptions-item-content:nth-child(6) > span:nth-child(1)').text();
            const serivce_center = $('tr.ant-descriptions-row:nth-child(2) > td:nth-child(2) > span:nth-child(1)').text();
            const last_status = $('.ant-badge-status-text').text();
            const detail = $('tr.ant-descriptions-row:nth-child(3) > td:nth-child(2) > span:nth-child(1)').text();
            console.log("/uscis: Fetching data.")
            console.log("=================CASE DETAILS OBTAINED==========================")
            console.log(`Receipt Number: ${receipt_no}`);
            console.log(`Receipt Block: ${receipt_block}`)
            console.log(`Form Type: ${form_type}`)
            console.log(`Service Center: ${serivce_center}`)
            console.log(`Latest status: ${last_status}`)
            console.log(`Details: ${detail}`)
            console.log("================================================================")
            console.log("/uscis: Filling in embed fill details")
            const USCISEmbed = new MessageEmbed()
            .setTitle(`${receipt_no}: ${last_status}`)
            .setURL("https://egov.uscis.gov/")
            .setDescription(`${detail}`)
            .setImage("https://sa1s3optim.patientpop.com/assets/docs/166738.png")
            .addFields(
                {
                    name: "Receipt Block",
                    value: receipt_block,
                    inline: true
                },
                {
                    name: "Form Type",
                    value: form_type,
                    inline: true
                  },
                {
                    name: "Service Center",
                    value: serivce_center,
                    inline: true
                })
            .setColor("#0000FF")
            .setFooter({
                text: "USCIS data here is pulled through a third party scraper. Always double check for accuracy at USCIS official website",
                iconURL: "https://sa1s3optim.patientpop.com/assets/docs/166738.png",
            });
            console.log("/uscis: Sending embed to Discord")
            await interaction.editReply({embeds: [USCISEmbed]});
            console.log("/uscis: Embed sent")
          } catch (error) {
            console.error('Error occurred:', error);
          }
            console.log(`/uscis: Finished executing`);

      },

};
