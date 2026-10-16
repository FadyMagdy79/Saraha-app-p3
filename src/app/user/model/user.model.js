import { Schema ,model } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        },
    },
    provider: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local",
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
    isverified: {
        type: Boolean,
        default: false,
    },
    dob:Date,
    gender: {
        type: String,
        enum: ["male", "female"],
        Default: "male",
    },
    profilePicPath: String,
     coverImagePaths: [String],
     cvPath: String,

},
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        }
    },
)

//model
export const User = model("User", userSchema);
