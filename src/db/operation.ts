import mongoose, { Model, Document } from 'mongoose';
const ObjectId = mongoose.Types.ObjectId


const OperationSchema: mongoose.Schema = new mongoose.Schema({
    opStatus: {
        type: Boolean
    },
    baseFare: {
        type: Number
    },
    perKm: {
        type: Number
    },


});

interface Operation extends Document {
    opStatus: boolean;
    baseFare:number 
    perKm:number
}

const Operation: Model<Operation> = mongoose.model<Operation>('Operation', OperationSchema);

export default Operation;
