//Importing Libraries 
import express from 'express'
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000


const startServer = (app: express.Express) => {
  //Listing to the app and running it on PORT 5000
  app.listen(PORT, async () => {
      console.log(`listning on port ${PORT}`)
  })

}

export default startServer;