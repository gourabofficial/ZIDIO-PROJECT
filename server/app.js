import express from 'express';
import connectDB from './src/config/mongodb.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT || 5000;



await connectDB();
app.use(express.json());


app.get('/', (req, res) => {
  res.send("Hari bol");
})


app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
}
);