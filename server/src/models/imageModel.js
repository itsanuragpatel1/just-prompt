import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    projectId: { type: mongoose.SchemaTypes.ObjectId, ref: 'project', required: true },
    prompt: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    presetUsed: { type: mongoose.SchemaTypes.ObjectId, ref: 'preset' },
    parentImage: { type: mongoose.SchemaTypes.ObjectId, ref: 'image' },
    type: { type: String, enum: ['Generate', 'Edit', 'Preset', 'Upload'] }
}, { timestamps: true })

const imageModel = mongoose.model('image', imageSchema);

export { imageModel }