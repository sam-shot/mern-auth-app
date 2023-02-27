import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from './router/route.js';
import connect from "./db/conn.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("API is Running");
});


app.use('/api',router);

const port = 5000;
connect().then(() => {
  try {
    app.listen(5000, () => {
      console.log("Server listening on 5000");
    });
  } catch (error) {
    console.log("Cannot connect to database");
  }
}).catch(error =>{
    console.log("Invalid DB connection");
});
