import { OpenAIApi, Configuration, CreateChatCompletionRequest, ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from 'openai';
import cheerio from 'cheerio';
import axios from 'axios';
import { MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

const url = 'https://www.dailymirror.lk/'; // URL of the website you want to scrape

export const lknews: CommandInt = {
    
    /* PYTHON EXCERPT:

    )*/
    data: new SlashCommandBuilder()
    .setName("lknews")
    .setDescription("Get SL news")
    //LEAVE THIS COMMENTED UNTIL MULTIPLE SELECTIONS CAN BE ADDED
    /*.addStringOption((option) =>
      option
        .setName("ref")
        .setDescription("The verse(s) to fetch, e.g. 1:1, 2:255, 1:1-7, 2:255-260")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("translation_key")
        .setDescription("Translation source you want to use. e.g. khattab (default)")
        .setRequired(true))*/,
    run: async (interaction) => {
        await interaction.deferReply();
        const run = async () => {
            try {
            console.log(`/lknews: Interaction executed by ${interaction.user.tag}`)
            console.log('/lknews: Fetching  data from dailymirror.lk')
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            console.log('/lknews: Staging arrays for headings and links on the mainpage')
            const headings: string[] = [];
            const links: string[] = [];
            console.log('/lknews: Extracting heading and links and pushing them into the array')
            let n: any = 1;
            while (n <= 4) {
                $(`#breakingnewsads > div:nth-child(${n}) > div:nth-child(1) > a:nth-child(1)`).each((index, element) => {
                const heading = $(element).text().trim();
                const link = $(element).attr('href') || '';
                headings.push(heading);
                links.push(link);
                });
                n++;
            }
            console.log('/lknews: Extracted headings:\n=============HEADINGS===============\n')
            for (const heading of headings) {
                console.log(`${heading}`);
            }

            let h: any = 0;
            const embeds = [];
            const extractedArticles: string[]  = [];
            const extractedArticleTime: string[] = [];
            console.log('/lknews: Extracting Article Contents')
            let l: any = 0;
            for (const link of links) {
                console.log(`/lknews:>>>>>>>>>>>RUNNING ARTICLE TEXT EXTRACTION<<<<<<<<<<<<<<<<<<`)
                const articleURL = link;
                const cssSelector = '#imgDiv';
                const timeSelector = '.col-xl-5 > div:nth-child(1) > p:nth-child(1) > span:nth-child(1)';
                try {
                    const extractedText = await extractTextFromURL(articleURL, cssSelector);
                    const extractedTime = await extractTextFromURL(articleURL, timeSelector);
                    console.log(`-----------------------------ARTICLE INDEXED ${[l]}-----------------------------------------`)
                    console.log(`HEADING: ${headings[l]}\n\n`)
                    console.log(`TEXT: ${extractedText}\n\n`);
                    console.log(`LINK: ${link}\n\n`);
                    console.log(`ARTICLE TIMESTAMP: ${extractedTime}\n`)
                    extractedArticles.push(extractedText)
                    extractedArticleTime.push(extractedTime);   
            
                  } catch (error) {
                    console.error('An error occurred:', error);
                  }
                  console.log("/lknews: Proceeding onto next article.");
                  l++;
                }
                console.log('/lknews: Initializing ChatGPTClient and OpenAI API connection')
                const client = new ChatGPTClient();
          
                console.log('/lknews: Generating ChatGPT summary promptS to summarize extracted content')
                for (const extractedArticle of extractedArticles) {
                    console.log(`/lknews:>>>>>>>>>>> PROCESSING PROMPT INDEXED AT ${h}<<<<<<<<<<<<<<<<<<`)
                    const chatGptMessages = [
                    { role: ChatCompletionRequestMessageRoleEnum.System, content: 'You are a helpful assistant.' },
                    { role: ChatCompletionRequestMessageRoleEnum.User, content: `Summarize this article: ${extractedArticle}` },
                    ];
                    try {
                        console.log('/lknews: Feeding generated prompt to ChatGPT client')
                        console.log('/lknews: Waiting on ChatGPT response......')
                        const result = await client.respond(chatGptMessages);
                        console.log('/lknews: Response received from ChatGPT')
                        console.log('/lknews: Generating Discord Embed with all the data.')
                        if (result.text) {
                            const colomboTime = new Date(extractedArticleTime[h]);
                            const utcTime = new Date(colomboTime.toLocaleString("en-US", { timeZone: "Asia/Colombo", timeZoneName: "short" }));
                            const timestamp = Math.floor(utcTime.getTime() / 1000); // Convert the UTC time to UNIX timestamp (seconds since January 1, 1970)
                            const LKnewsEmbed = new MessageEmbed()
                            .setColor("#7cc5b5")
                            .setTitle(`${headings[h]}`)
                            .setURL(`${links[h]}`)
                            .setDescription(result.text)
                            .addFields({name:`Created on`, value: `<t:${timestamp}:R>`, inline: false})
                            .setFooter({ text: 'DailyMirror', iconURL: 'https://vernoncorea.files.wordpress.com/2012/09/dailymorror.jpg' });
                            embeds.push(LKnewsEmbed);
                            h++;
                        } else {
                            console.log("/lknews: No response from ChatGPT.");
                        }
                    console.log('/lknews: Proceeding onto next prompt.')
                } catch (error) {
                console.error('An error occurred:', error);
                console.log("An error occurred. Please try again later.");
                }
            }
            interaction.editReply({ embeds: [embeds[0], embeds[1], embeds[2]] });
            } catch (error) {
            console.log('Error:', error);
            }
            console.log('/lknews: No more prompts.')
            console.log('/lknews: Interaction finished executing.')
        };
        
        run();
        
    },

};


async function extractTextFromURL(url: string, cssSelector: string): Promise<string> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const paragraphs = $(cssSelector).toArray();
      const text = paragraphs.map((p) => $(p).text().trim()).join('\n');
      return text;
    } catch (error) {
      console.error('An error occurred while extracting text:', error);
      throw error;
    }
  }
 
class ChatGPTClient{
    private openAI: OpenAIApi;

    constructor() {

        const configuration = new Configuration({
            apiKey: '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',
        });
        this.openAI = new OpenAIApi(configuration);
    }

    async respond(chatGPTMessages: Array<ChatCompletionRequestMessage>) {
        try {
            if (!chatGPTMessages) {
                return {
                    text: 'No chatGPTMessages',
                };
            }

            const request: CreateChatCompletionRequest = {
                messages: chatGPTMessages,
                model: 'gpt-3.5-turbo',
       
            };

            const response = await this.openAI.createChatCompletion(request);
            if (!response.data || !response.data.choices) {
                
                return {
                    text: "The bot didn't respond. Please try again later.",
                };
            }

            return {
                text: response.data.choices[0].message?.content,
                messageId: response.data.id,
            };
        } catch (error: any) {
            console.log('E: ', error);
            throw new Error(error);
        }
    }
}



