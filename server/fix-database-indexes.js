import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const fixDatabaseIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection('paymentdetails');

    // Get current indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    // Drop the problematic unique indexes if they exist
    try {
      await collection.dropIndex('receiptUrl_1');
      console.log("Dropped receiptUrl_1 index");
    } catch (error) {
      console.log("receiptUrl_1 index doesn't exist or already dropped");
    }

    try {
      await collection.dropIndex('transactionId_1');
      console.log("Dropped transactionId_1 index");
    } catch (error) {
      console.log("transactionId_1 index doesn't exist or already dropped");
    }

    // Create new sparse unique indexes
    await collection.createIndex(
      { receiptUrl: 1 }, 
      { unique: true, sparse: true, name: 'receiptUrl_1_sparse' }
    );
    console.log("Created sparse unique index for receiptUrl");

    await collection.createIndex(
      { transactionId: 1 }, 
      { unique: true, sparse: true, name: 'transactionId_1_sparse' }
    );
    console.log("Created sparse unique index for transactionId");

    // Verify new indexes
    const newIndexes = await collection.indexes();
    console.log("Updated indexes:", newIndexes);

    console.log("Database indexes fixed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("Error fixing database indexes:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

fixDatabaseIndexes();
