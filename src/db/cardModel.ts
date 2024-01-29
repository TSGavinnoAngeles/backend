import mongoose, { Model, Document } from 'mongoose';

const CardSchema: mongoose.Schema = new mongoose.Schema({
    idNums: { 
        type: Number,
     },
    bal: {
        type: Number,
     },

    stat: { 
        type: Boolean,

     },
  });

interface Card extends Document {
    idNums: Number,
    bal: Number, 
    stat: boolean
}


const Cards: Model<Card> = mongoose.model<Card>('cardUsers', CardSchema);

export default Cards;
