import mongoose from "mongoose";

async function connect() {
  const uri = "mongodb://0.0.0.0:27017";

  mongoose.set("strictQuery", true);
  const db = await mongoose.connect(uri);
  console.log("Database Connected at ", db.connection.host);
  return db;
}

export default connect;
