import { connect } from 'mongoose';

async function connectDB() {
  const connectString =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/myapp';

  try {
    const conn = await connect(connectString);
    console.log(`DB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('connection error:', error);
    process.exit(1);
  }
}

export default connectDB;
