/*
 |--------------------------------------------------------------------------
 | Import mongoose's Schema.Import bcrypt for password
 |--------------------------------------------------------------------------
 */
import moongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
/*
 |--------------------------------------------------------------------------
 | Set up schema.
 |--------------------------------------------------------------------------
 */
const usersSchema = new Schema({
    name: String,
    email: { type: String, required: true },
    password: String,
    googleId: { type: String, default: null },
    image: { type: String, default: null },
    role : { type: Number, default: 0 },
}, { collection : 'users' });

usersSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

usersSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
/*
 |--------------------------------------------------------------------------
 | Export users model.
 |--------------------------------------------------------------------------
 */
export default moongoose.model('users', usersSchema);