import mongoose from "mongoose";

async function connect() {
  const uri = "mongodb+srv://samshot:samshot01@cluster0.farpl8z.mongodb.net/?retryWrites=true&w=majority";

  mongoose.set("strictQuery", true);
  const db = await mongoose.connect(uri);
  console.log("Database Connected at ", db.connection.host);
  return db;
}

export default connect;
