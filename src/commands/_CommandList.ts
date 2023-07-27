import { CommandInt } from "../interface/Command";
import { oneHundred } from "./oneHundred";
import { view } from "./view";
import { boop } from "./boop";
import { google } from "./google";
import {clone} from "./clone";
import {hug} from "./hug";
import {year_progress} from "./year_progress";
import {year_remaining} from "./year_remaining";
import {urban_dict} from "./urban_dict";
import { youtube } from "./youtube";
import { wikipedia } from "./wikipedia";
import { reminder } from "./reminder";
import { show_reminders } from "./show_reminders";
import { test } from "./test";
import { twitter } from "./twitter";
import { instagram } from "./instagram";
import { steam_user } from "./steam_user";
import { steam_game } from "./steam_game";
import { quran } from "./quran";
import { infrastructure } from "./infrastructure";
import { mc_server } from "./mc_server";
import { define } from "./define";
import { serverinfo } from "./serverinfo";
import { weather } from "./weather"
import { chatgpt } from "./chatgpt"
import { timeuntil } from "./timeuntil"
import { lknews } from "./lknews"
import { uscis } from "./uscis"
 
export const CommandList: CommandInt[] = [oneHundred, view, boop, google, clone, hug, year_progress, year_remaining, urban_dict, youtube, wikipedia, reminder, show_reminders, test, twitter, instagram, steam_user, steam_game, quran, infrastructure, mc_server, define, serverinfo, weather, chatgpt, timeuntil, lknews, uscis];