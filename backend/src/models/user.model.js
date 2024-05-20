import { model, Schema } from "mongoose";
export const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true, //by adding this createdAt and UpdatedAt fields will be automatically added to every new user we added
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const UserModel = model("user", UserSchema);
