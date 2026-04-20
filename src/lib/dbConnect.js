// import mongoose from "mongoose";

// type connectionObject = {
//   isConnected?: number;
// };

// const connection: connectionObject = {};

// async function dbConnect(): Promise<void> {
//   if (connection.isConnected) {
//     console.log("Database already connected");
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

//     connection.isConnected = db.connections[0].readyState;

//     console.log("Database connected successfully");
//   } catch (error) {
//     console.log("Database connection faild", error);
//     process.exit(1);
//   }
// }

// export default dbConnect;




import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  // Check if we have a connection and EXIT early if we do
  if (connection.isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      bufferCommands: false,
    });

    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    
    throw error;
  }
}

export default dbConnect;