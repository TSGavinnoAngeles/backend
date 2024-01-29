import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose, { ConnectOptions, Document, Schema, Model } from 'mongoose';
import Users from './userModel';
import dotenv from 'dotenv';

dotenv.config();

// Define schema for the "users" collection
interface User extends Document {
  email: string;
  password: string;
}

const userSchema: Schema<User> = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel: Model<User> = mongoose.model('User', userSchema);

// Define schema for the "cards" collection
interface Card extends Document {
  idNums: string;
  bal: number;
  stat: string;
}

const cardSchema: Schema<Card> = new Schema({
  idNums: { type: String, required: true },
  bal: { type: Number, required: true },
  stat: { type: String, required: true },
});

const CardModel: Model<Card> = mongoose.model('Card', cardSchema);

// express app
const app: Express = express();

// middleware
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path, req.method);
  next();
});

async function dbConnect(): Promise<void> {
  // use mongoose to connect this app to our database on MongoDB using the DB_URL (connection string)
  try {
    await mongoose.connect(
      process.env.DB_URL as string,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      } as ConnectOptions,
    );
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  }
}

// // Example route to fetch data from the "users" collection
// app.get('/user', async (req: Request, res: Response) => {
//   try {
//     const users: User[] = await UserModel.find();
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Example route to fetch data from the "cards" collection
// app.get ('/card', async (req: Request, res: Response) => {
//   try {
//     const cards: Card[] = await CardModel.find();
//     res.json(cards);
//   } catch (error) {
//     console.error('Error fetching cards:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

export default dbConnect;
