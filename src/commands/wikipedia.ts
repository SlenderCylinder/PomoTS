import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import {MessageEmbed} from "discord.js";
import fetch from "node-fetch";
//import ismfetch from 'isomorphic-fetch';

export const wikipedia: CommandInt = {
    data: new SlashCommandBuilder()
      .setName("wikipedia")
      .setDescription("Search Wikipedia")
      .addStringOption((option) =>
        option
          .setName("term")
          .setDescription("Search term")
          .setRequired(true)
      ),
    run: async (interaction) => {
      const query = interaction.options.getString("term", true);
      console.log(`/wikipedia: interaction executed by ${interaction.user.tag} with the query "${query}"`)
      await interaction.deferReply();
      try {
        console.log(`/wikipedia: Handshaking with Wikipedia API and searching for the closest article match...`)
        const topSearchResult = await searchAndReturnClosestArticle(query)
        console.log(`/wikipedia: Closest matching article for "${query}" is ${topSearchResult}`)
        console.log(`/wikipedia: Requesting "${topSearchResult}" from Wikipedia API...`)
        const result = await fetchWikipedia(topSearchResult);
        console.log(`/wikipedia: Article content received`)
        const title = result.title
        const summary = result.summary
        const url = result.url
        const imageURL = result.imageUrl
        console.log(`/wikipedia: Filling in Discord Embed with the data`)
        const wikiEmbed = new MessageEmbed()
        .setTitle(title)
        .setURL(url)
        .setDescription(summary)
        .setImage(imageURL)
        /*.addFields(
            {
            name: "Examples(s)",
            value: examples,
            inline: true
            })*/
        .setColor("#ffffff")
        .setFooter({
            text: "Wikipedia",
            iconURL: "https://icons.iconarchive.com/icons/sykonist/popular-sites/256/Wikipedia-globe-icon.png",
        });

        await interaction.editReply({embeds: [wikiEmbed]});
        console.log(`/wikipedia: Embed sent`)
        console.log(`/wikipedia: Finished executing`)} catch (err) {
        console.error(err);
        await interaction.editReply({ content: "Error: Failed to fetch Wikipedia article" });
        console.log(`/wikipedia: Finished executing`)
      }

    },
  };


interface WikipediaSearchResponse {
    query: {
      search: {
        title: string;
      }[];
    };
  }
  

  
async function searchAndReturnClosestArticle(term: string): Promise<string> {
    try {
      // Search for the closest matching article
      const closestArticle = await searchClosestArticle(term);
  
      // Return the title of the closest matching article
      return closestArticle;
    } catch (error) {
      console.error("Error occurred while searching Wikipedia:", error);
      return "Error: Failed to search Wikipedia";
    }
  }

async function searchClosestArticle(term: string): Promise<string> {
    // Replace spaces in the search term with underscores
    const encodedTerm = encodeURIComponent(term.replace(/\s+/g, "_"));
  
    // Make a request to the Wikipedia API for the search results
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedTerm}&format=json`
    );
  
    // If the response status code is not OK, throw an error
    if (!response.ok) {
      throw new Error("Failed to fetch Wikipedia search results");
    }
  
    // Parse the response JSON and extract the closest matching article title
    const data = await response.json() as unknown;
    const searchResults = (data as { query: { search: { title: string }[] } }).query.search;
    if (searchResults.length === 0) {
      throw new Error("No matching articles found");
    }
    const closestArticle = searchResults[0].title;
  
    return closestArticle;
}


async function fetchWikipedia(term: string): Promise<{ title: string, summary: string, url: string,  imageUrl: string}> {
  // Replace spaces in the search term with underscores
  const encodedTerm = encodeURIComponent(term.replace(/\s+/g, "_"));

  // Make a request to the Wikipedia API for the summary section of the article
  const response = await fetch(
  `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTerm}`
  );

  // If the response status code is not OK, throw an error
  if (!response.ok) {
  throw new Error("Failed to fetch Wikipedia article");
  }

  // Parse the response JSON and extract the title, summary section, and URL
  const data = await response.json();
  const title = data.title;
  const summary = data.extract;
  const url = data.content_urls.desktop.page;
  const imageUrl = data.thumbnail?.source || "";

  return { title, summary, url, imageUrl };
}

// Example usage
//searchWikipedia("typescript").then(({ title, summary, url }) => {
//    console.log(`Title: ${title}\nSummary: ${summary}\nURL: ${url}`);
//});

