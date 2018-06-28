import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const OrderSchema = new Schema({
  createdDate: {
    type: Date,
    default: Date.now
  },
  status: String,
  modelType: Number
});