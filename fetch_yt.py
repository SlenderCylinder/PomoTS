import discord
from discord.ext import commands, tasks
from discord import PCMVolumeTransformer
import pytube
import asyncio
import subprocess
import sys

intents = discord.Intents.default()
intents.typing = False
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', help_command=None, intents=intents)

@bot.event
async def on_ready():
    print('Bot is ready.')

    if len(sys.argv) >= 2:
        video_url = sys.argv[1]
    else:
        video_url = "https://www.youtube.com/watch?v=vTVWGoQcn9Q"

    vc = bot.get_channel(700446728687714379)
    vc_chat = bot.get_channel(975096898765611048)
    await play_audio(vc = vc, vc_chat = vc_chat, video_url = video_url)

async def play_audio(vc, vc_chat, video_url):
        # check if the user is in a voice channel
        if not vc.members:
            await vc_chat.send("You need to be in a voice channel to use this command.")
            return

        # join the user's voice channel
        voice = await vc.connect()


        try:
            video = pytube.YouTube(video_url)
            audio_url = video.streams.filter(only_audio=True).first().url
            audio_source = discord.PCMVolumeTransformer(discord.FFmpegPCMAudio(audio_url, before_options="-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5"))

            def after_playing(err):
                if err:
                    print(f"Error while playing audio: {err}")
                    asyncio.run_coroutine_threadsafe(vc_chat.send("An error occurred while playing audio."), bot.loop)
                else:
                    print("Audio finished playing.")
                    asyncio.run_coroutine_threadsafe(vc_chat.send("Audio finished playing."), bot.loop)
                    voice.disconnect()

                print("Audio finished playing.")

                # Exit the voice channel
                asyncio.run_coroutine_threadsafe(voice.disconnect(), bot.loop)
                sys.exit()

            voice.play(audio_source, after=after_playing)

            await vc_chat.send(f"Now playing: {video.title}\nDebug mode: on\nCommand is still in dev mode")

        except Exception as e:
            print("Error while playing audio:", e)
            await vc_chat.send("An error occurred while playing audio.")


        '''filename = message.content.split(' ', 1)[1]

        # play the audio in the voice channel
        source = discord.FFmpegPCMAudio(filename)
        vc.play(PCMVolumeTransformer(source))
        await message.channel.send(f"Now playing: {filename}")'''


bot.run('ODkyMDg1ODA1ODE4OTkwNjIz.YVHxpg.y4dts2G6pmnK4jLX6pbxxEcSW4w')