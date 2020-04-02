/*
 |--------------------------------------------------------------------------
 | Import the mongoose module.
 |--------------------------------------------------------------------------
 */
import mongoose from "mongoose";

/*
 |--------------------------------------------------------------------------
 | Get Mongoose to use the global promise library.
 |--------------------------------------------------------------------------
 */
mongoose.Promise = global.Promise;

/*
 |--------------------------------------------------------------------------
 | Export default mongoose connection.
 |--------------------------------------------------------------------------
 */
export default function connect() {
  const url = process.env.MONGO_URL;
  return mongoose.connect(url, { useNewUrlParser: true });
}
