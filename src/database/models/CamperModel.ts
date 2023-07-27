import { Document, model, Schema } from "mongoose";

export interface CamperInt extends Document {
    discordId: String,
    round: number,
    day: number,
    timestamp: number,
}

export const Camper = new Schema({
    discordId: String,
    round: Number,
    day: Number,
    timestamp: Number,
});

const CamperSchema = new Schema({
    discordId: String,
    round: Number,
    day: Number,
    timestamp: Number,
  });
  

export default model<CamperInt>("camper", CamperSchema);