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
const domainApprovedSchema = new Schema(
  {
    userid: { type: String, required: true },
    status: { type: Boolean, required: true },
    domain: { type: String, required: true },
    logged: { type: Date, required: true }
  },
  { collection: "domain_approved" }
);

/*
 |--------------------------------------------------------------------------
 | Export DomainApproved model.
 |--------------------------------------------------------------------------
 */
export default moongoose.model("domain_approved", domainApprovedSchema);
