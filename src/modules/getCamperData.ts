import CamperModel from "../database/models/CamperModel";

export const getCamperData = async (id: string) => {
    const CamperData = 
    (await CamperModel.findOne( {id})) ||
    (await CamperModel.create({
        discordId:id,
        round:1,
        day:0,
        date: Date.now(),
    }));
    return CamperData;

};

export const getAllCamperData = async (id: string) => {
    const camperData = await CamperModel.find({ discordId: id });
    return camperData;
  };