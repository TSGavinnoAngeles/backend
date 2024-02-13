import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import startServer from './server';
import {stations as stations} from './stations';
import dbConnect from './db/dbConnect';
import mongodb from "mongodb";
import User from './db/userModel';
import Cards from './db/cardModel';
import Station from './db/station';
import Operation from './db/operation';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const secretKey = 'adljalgidalgaldkjahf10871395'; // just random like keybord smash 
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

    const usersData = users.map((user: { _id: any; email: any; password: any; }) => ({
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

    const cardsData = cards.map((card: { bal: any; idNums: any; stat: any; }) => ({
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

app.get('/cards', async (req, res) => {
  try {
    // Retrieve all users from the database
    const cards = await Cards.find();

    if (!cards || cards.length === 0) {
      return res.status(404).json({ message: 'No cards found' });
    }

    const cardsData = cards.map((card: { bal: any; idNums: any; stat: any; }) => ({
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



app.get('/stations', async (req, res) => {
  try {
    // Retrieve all stations from the database
    const stations = await Station.find();

    if (!stations || stations.length === 0) {
      return res.status(404).json({ message: 'No Stations found' });
    }

    const stationsData = stations.map((station) => ({
      _id: station._id,
      coordinates: station.coordinates,
      connecting: station.connecting,
      active: station.active,
      stationId: station.stationId,
      label: station.label,
      position: station.position
    }));

    res.json(stationsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/stations/:stationId', async (req, res) => {
  const { stationId } = req.params;
  try {
    // Retrieve all stations from the database
    const coordStation = await Station.find({stationId});

    if (!stations || stations.length === 0) {
      return res.status(404).json({ message: 'No Stations found' });
    }

    const stationsData = coordStation.map((station) => ({
      coordinates: station.coordinates,

    }));

    res.json(stationsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/addStat', async (req, res) => {
  const { coordinates, stationId, label, position, active, connecting} = req.body;
  if(coordinates === null || stationId === null || label === null || position === null ){
    res.status(500).json({ message: 'Internal Server Error' });
  } else {
    try {
      const newStation = await Station.create({
        coordinates,
        connecting,
        stationId,  
        label,
        position, 
        active
      });
  
      res.json({ message: 'Station added successfully', newStation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});



app.get('/checkstations/:_id', async (req, res) => {
  const {_id} = req.params;
  try {
    // Retrieve all stations from the database
    const coordStation = await Station.find({_id});

    if (!stations || stations.length === 0) {
      return res.status(404).json({ message: 'No Stations found' });
    }

    const stationsData = coordStation.map((station) => ({
      _id: station._id,
      coordinates: station.coordinates,
      connecting: station.connecting

    }));

    res.json(stationsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.put('/stations/connections/:_id', async (req, res) => {
  const { _id } = req.params;
  const { connecting } = req.body;

  try {
    // Find the document by ObjectId
    const stat = await Station.findOne({ _id });

    if (!_id) {
      return res.status(400).json({ error: '_id cannot be null' });
    }

    if (!stat) {
      return res.status(404).json({ error: 'Station not found' });
    }

    if (!Array.isArray(connecting)) {
      return res.status(400).json({ error: 'Connecting must be an array' });
    }


    stat.connecting = connecting;


    const updatedDocument = await stat.save();

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.put('/stations/position/:_id', async (req, res) => {
  const { _id } = req.params;
  const { position } = req.body;

  try {
    const stat = await Station.findOne({ _id });

    if (!_id) {
      return res.status(400).json({ error: '_id cannot be null' });
    }

    if (!stat) {
      return res.status(404).json({ error: 'Station not found' });
    }

    if (!Array.isArray(position) && position.length !== 2) {
      return res.status(400).json({ error: 'Position must be an array' });
    }

    stat.position = position;

    const updatedDocument = await stat.save();

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/delStation/:_id', async (req, res) => {
  const { _id } = req.params;

  try {
    // Find the card by _id and delete it
    const deletedStation = await Station.findOneAndDelete({ _id });

    if (!deletedStation) {
      return res.status(404).json({ error: 'Station not found' });
    }

    res.json({ message: 'Card deleted successfully', deletedStation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/operation', async (req, res) => {
  try {
    const operations = await Operation.find();

    if (!operations|| operations.length === 0) {
      return res.status(404).json({ message: 'No Operational Details found' });
    }

    const operationsData = operations.map((operation) => ({
      opStatus: operation.opStatus, 
      baseFare: operation.baseFare, 
      perKm: operation.perKm
    }));

    res.json(operationsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/operation/:_id', async (req, res) => {
  const { _id } = req.params;
  const { baseFare, perKm } = req.body;

  try {
    const ops = await Operation.findOne({ _id });

    if (!_id) {
      return res.status(400).json({ error: '_id cannot be null' });
    }

    if (!ops) {
      return res.status(400).json({ error: 'ops cannot be null' });
    }

    if (!baseFare) {
      return res.status(404).json({ error: 'Base Fare not found' });
    }

    if (!perKm) {
      return res.status(400).json({ error: 'Per Kilometer rate not found' });
    }

    ops.baseFare = baseFare;
    ops.perKm = perKm;

    const updatedDocument = await ops.save();

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/stations/coordinates/:_id', async (req, res) => {
  const { _id } = req.params;
  const {coordinates } = req.body;

  try {
    // Find the document by ObjectId
    const stat = await Station.findOne({ _id });

    if (!_id) {
      return res.status(400).json({ error: '_id cannot be null' });
    }

    if (!stat) {
      return res.status(404).json({ error: 'Station not found' });
    }
    if (!Array.isArray(coordinates) && coordinates.length === 2 ) {
      return res.status(400).json({ error: 'Coordinates must be an array' });
    }

    stat.coordinates = coordinates;

    const updatedDocument = await stat.save();

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});









startServer(app);