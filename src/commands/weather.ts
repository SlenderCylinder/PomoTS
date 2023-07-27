import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInt } from "../interface/Command";
import axios from 'axios';

//Setting up the command to match the specific command on the Python module
export const weather: CommandInt = {
    data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get weather data for Joanna and Chamith"),
    run: async (interaction) => {
        const user = interaction.user.tag;
        console.log(`/weather: executed by ${user}`)
        await interaction.deferReply();
        async function getWeather(): Promise<string> {
            const ny_url = `https://api.open-meteo.com/v1/forecast?latitude=40.56&longitude=-74.14&hourly=temperature_2m&current_weather=true&forecast_days=0`;
            const ny_aq_url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=40.56&longitude=-74.14&hourly=us_aqi`;
            const cmb_url = `https://api.open-meteo.com/v1/forecast?latitude=6.94&longitude=79.85&hourly=temperature_2m&current_weather=true&forecast_days=0`;
            const cmb_aq_url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=6.94&longitude=79.85&hourly=us_aqi`;
          
            const ny_url_f= `https://api.open-meteo.com/v1/forecast?latitude=40.56&longitude=-74.14&hourly=temperature_2m&current_weather=true&temperature_unit=fahrenheit&forecast_days=0`;
            const cmb_url_f = `https://api.open-meteo.com/v1/forecast?latitude=6.94&longitude=79.85&hourly=temperature_2m&current_weather=true&temperature_unit=fahrenheit&forecast_days=0`;
          
            try {
              const response_ny = await axios.get(ny_url);
              const response_ny_aq = await axios.get(ny_aq_url);
              const response_cmb = await axios.get(cmb_url);
              const response_cmb_aq = await axios.get(cmb_aq_url);
              const response_ny_f = await axios.get(ny_url_f);
              const response_cmb_f = await axios.get(cmb_url_f);
              const weatherData_ny= response_ny.data;
              const weatherData_cmb = response_cmb.data;

              const airqualityData_cmb = response_cmb_aq.data;
              const airqualityData_ny = response_ny_aq.data;
          
              const weatherData_ny_f= response_ny_f.data;
              const weatherData_cmb_f = response_cmb_f.data;
          
              const temperature_ny = weatherData_ny.current_weather.temperature;
              const temperature_cmb = weatherData_cmb.current_weather.temperature;
              const airquality_cmb = airqualityData_cmb.hourly.us_aqi[0];
              const airquality_ny = airqualityData_ny.hourly.us_aqi[0];

              const airquality_cmb_text = getAirQualityLevel(airquality_cmb);
              const airquality_ny_text = getAirQualityLevel(airquality_ny);
          
              const temperature_ny_f = weatherData_ny_f.current_weather.temperature;
              const temperature_cmb_f = weatherData_cmb_f.current_weather.temperature;
 
          
              return `Weather in Staten Island, NY, US: ${temperature_ny}°C (${temperature_ny_f}°F)\nWeather in Colombo, LK: ${temperature_cmb}°C (${temperature_cmb_f}°F)\n\nAir Quality Index in Staten Island: ${airquality_ny} (${airquality_ny_text})\nAir Quality Index in Colombo: ${airquality_cmb} (${airquality_cmb_text})`;
            } catch (error) {
              console.error('Error fetching weather data:', error);
              return 'Failed to fetch weather information.';
            }
          }

          const colomboWeather = await getWeather();

          await interaction.editReply(colomboWeather)
        
        console.log("/weather: Finished executing")

      },

};

function getAirQualityLevel(index: number): string {
  if (index <= 50) {
    return 'good';
  } else if (index <= 100) {
    return 'moderate';
  } else if (index <= 150) {
    return 'unhealthy';
  } else {
    return 'hazardous';
  }
}