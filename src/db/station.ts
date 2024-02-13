import mongoose, { Model, Document } from 'mongoose';
const ObjectId = mongoose.Types.ObjectId


const StationSchema: mongoose.Schema = new mongoose.Schema({
    coordinates: {
        type: [Number]
    },
    connecting: {
        type: [String]
    },
    active: {
        type: Boolean
    },
    // react flow parameters
    stationId: {
        type: String
    },
    label: {
        type: String
    },    
    position: {
        type: [Number]
    },


});

interface Station extends Document {
    coordinates: [number, number];
    connecting: string[];
    active: boolean;
    stationId: string; 
    label: string; 
    position: [number, number];
}

const Station: Model<Station> = mongoose.model<Station>('Station', StationSchema);

export default Station;
