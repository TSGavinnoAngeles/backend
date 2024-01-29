import dbConnect from './dbConnect';
import mongoose from 'mongoose';
import express from 'express'; 
import User from './userModel';
import * as dotenv from 'dotenv';

const app = express();
export async function fetchDatafromDatabase() { 
    dbConnect();
  
    const UserSchema = new mongoose.Schema({
      email: {
        type: String,
     },
  
    password: { 
        type: String,
     },

    });
  
    const Users = mongoose.model('Users', UserSchema); 
    
    try {
      // Fetch data from the database (replace {} with your actual query)
      const data = await Users.find({email: "jerma@admin.com"});
  
      // Output the retrieved data
      console.log('Data from the database:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  }

