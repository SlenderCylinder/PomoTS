import {CamperInt} from "../database/models/CamperModel";

export const updateCamperData = async (Camper: CamperInt) => {
    Camper.day++;
    if (Camper.day> 100) {
        Camper.day = 1;
        Camper.round++;
    }
    Camper.timestamp = Date.now();
    await Camper.save();
    return Camper;

};

/*

export const updateCamperData = async (Camper: CamperInt) => {
  const newCamper = new CamperModel({
    discordId: Camper.discordId,
    round: Camper.round + 1,
    day: 1,
    timestamp: Date.now(),
  });

  await newCamper.save();
  return newCamper;
};

*/