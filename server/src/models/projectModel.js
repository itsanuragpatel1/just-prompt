import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'user', required: true },
    projectType: { type: String, enum: ['Generate', 'Edit', 'Preset'] },
    editHistory: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'image' }],
    lastImageId: { type: mongoose.SchemaTypes.ObjectId, ref: 'image' },
}, { timestamps: true })

const projectModel = mongoose.model('project', projectSchema);

export { projectModel }