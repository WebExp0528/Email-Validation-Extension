import mongoose from 'mongoose';

const { Schema } = mongoose;

const examplesSchema = new Schema({
    exampleField: String,
}, {
  versionKey: false,
});

export default mongoose.model('examples', examplesSchema);