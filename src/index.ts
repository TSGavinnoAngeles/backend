import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import startServer from './server';
import {stations as stations} from './stations';
import dbConnect from './db/dbConnect';
import mongodb from "mongodb";
import mongoose from 'mongoose';
import User from './db/userModel';
import Cards from './db/cardModel';
import * as jwt from 'jsonwebtoken';

const secretKey = 'adljalgidalgaldkjahf10871395';
// import {  fetchDatafromDatabase as fetchMongo} from './db/index'
const PORT = process.env.PORT || 3000
//import startServer from 'server';

//App Varaibles 
dotenv.config();
dbConnect();
//intializing the express app 
const app = express(); 


//using the dependancies
app.use(helmet()); 
app.use(cors()); 
app.use(express.json())

app.get('/list-stations', (req, res)=> {
  res.json([
    stations
  ]).status(200);
})

app.get('/stations/get/:id', (req, res)=> {
  const id = req.params['id']; 
  const station = stations.find((s)=>s.id === Number(id));
  if (station){
    res.send([
      station?.stationName
    ]).status(200);
  } else {
    res.status(500).send([
      "DNE"
    ]).status(200);
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    } else {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        secretKey,
        { expiresIn: '1h' }
      );
      res.status(200).json({ message: 'Login successful', token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





app.get('/users', async (req, res) => {

  try {
    // Retrieve all users from the database
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const usersData = users.map(user => ({
      _id: user._id,
      email: user.email,
      password: user.password,
      

    }));

    res.json(usersData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/cards', async (req, res) => {
  try {
    // Retrieve all users from the database
    const cards = await Cards.find();

    if (!cards || cards.length === 0) {
      return res.status(404).json({ message: 'No cards found' });
    }

    const cardsData = cards.map(card => ({
      bal: card.bal,
      idNums: card.idNums,  
      stat: card.stat,
    
    }));

    res.json(cardsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.patch('/cards/:idNums', async (req, res) => {
  const { idNums } = req.params;
  const { updatedValue, isAddition } = req.body;

  try {

    const card = await Cards.findOne({ idNums });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    let newBalance: number;

    if (isAddition) {

      newBalance = card.bal + updatedValue;
    } else {

      if (Number(card.bal) - updatedValue < 0) {
        return res.status(400).json({ error: 'Cannot deduct beyond current balance' });
      }

      newBalance = Number(card.bal) - updatedValue;
    }

 
    const updatedDocument = await Cards.findOneAndUpdate(
      { idNums: card.idNums },
      { bal: newBalance },
      { new: true }
    );

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/delCards/:idNums', async (req, res) => {
  const { idNums } = req.params;

  try {
    // Find the card by idNums and delete it
    const deletedCard = await Cards.findOneAndDelete({ idNums });

    if (!deletedCard) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ message: 'Card deleted successfully', deletedCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/addcards', async (req, res) => {
  const { idNums, bal, stat } = req.body;
  if(idNums === null || bal === null || stat === null ){
    res.status(500).json({ message: 'Internal Server Error' });
  } else {
    try {
      // Create a new card document
      const newCard = await Cards.create({
        idNums,
        bal,  
        stat,
      });
  
      res.json({ message: 'Card added successfully', newCard });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

app.get('/checkIdExists/:idNums', async (req, res) => {
  const { idNums } = req.params;

  try {
    const existingCard = await Cards.findOne({ idNums });

    res.json({ exists: existingCard !== null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});







startServer(app);