import { OpenAIApi, Configuration, CreateChatCompletionRequest, ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";

export const chatgpt: CommandInt = {
    
    /* PYTHON EXCERPT:

    )*/
    data: new SlashCommandBuilder()
    .setName("chatgpt")
    .setDescription("Send a prompt to ChatGPT (Non-conversational mode)")
    .addStringOption(option => option.setName('prompt').setDescription('What do you want to ask about?').setRequired(true)),
    run: async (interaction) => {
        await interaction.deferReply({ephemeral: false});
        const user = interaction.user.tag;
        const prompt = interaction.options.getString('prompt')


        console.log(`/chatgpt: interaction executed by ${user} with the prompt "${prompt}"`);
        console.log(`/chatgpt: Genearting API digestable version of the prompt"`);
        const chatGptMessages = [
            {
                    role: ChatCompletionRequestMessageRoleEnum.System,
                    content: 'You are a helpful assistant.',
            },
             {
              role: ChatCompletionRequestMessageRoleEnum.User,
              content: `${prompt}`,
            }
          ]
          console.log(`/chatgpt: Initializing a new ChatGPT client - OpenAI API (Re-initialized at every execution; messages won't be saved in this version)"`);
          const client = new ChatGPTClient()
          console.log(`/chatgpt: Feeding the generated prompt to client`);
          try {
            console.log(`/chatgpt: Waiting on response from API.`);
            const result = await client.respond(chatGptMessages);
            console.log(`/chatgpt: ChatGPT response received`);
            console.log(`=================Response============\n${result.text}\n=======================================`);
        
            if (result.text) {
            console.log(`/chatgpt: Sending response to Discord`)
              await interaction.editReply(result.text);
              console.log(`/chatgpt: Response sent`)
              console.log(`/chatgpt: Finished executing`)
            } else {
              await interaction.editReply("No response from the bot.");
              console.log(`/chatgpt: Finished executing`)
            }
          } catch (error) {
            console.error('An error occurred:', error);
            await interaction.editReply("An error occurred. Please try again later.");
            console.log(`/chatgpt: Finished executing`)
          }
    },
    
};




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


