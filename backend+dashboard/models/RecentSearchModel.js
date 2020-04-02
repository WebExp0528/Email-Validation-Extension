/*
 |--------------------------------------------------------------------------
 | Import mongoose's Schema.
 |--------------------------------------------------------------------------
 */
import moongoose, { Schema } from "mongoose";

/*
 |--------------------------------------------------------------------------
 | Set up schema.
 |--------------------------------------------------------------------------
 */
const recentSearchSchema = new Schema(
  {
    userid: { type: String, required: true },
    status: { type: Boolean, required: true },
    email: { type: String, required: true },
    expire: Date,
    logged: { type: Date, required: true }
  },
  { collection: "recent_search" }
);

/*
 |--------------------------------------------------------------------------
 | Export RecentSearchList model.
 |--------------------------------------------------------------------------
 */
export default moongoose.model("recent_search", recentSearchSchema);
