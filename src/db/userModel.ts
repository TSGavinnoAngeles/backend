import mongoose, { Model, Document } from 'mongoose';

const UserSchema: mongoose.Schema = new mongoose.Schema({
    _id: { 
        type: String
     },
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
     },
  
    password: { 
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
     },
  });

interface User extends Document {
    _id: string,
    email: string, 
    password: string
}


const Users: Model<User> = mongoose.model<User>('Users', UserSchema);

export default Users;
