import mongoose from "mongoose";

const presetSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    prompt: { type: String, trim: true, required: true },
    image: String,
  },
  { timestamps: true }
);

export const presetModel =
  mongoose.models.preset || mongoose.model("preset", presetSchema);
