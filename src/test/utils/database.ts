import mongoose from 'mongoose';

export const connectDatabase = async () => {
  await mongoose.connect(
    String(process.env.DB_URI),
    {
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      dbName: 'bedrockapi_tests',
    },
  );
};

export const cleanDatabaseAndClose = async () => {
  await mongoose.connection.db?.dropDatabase();
  await mongoose.connection.close();
};
