const { randomBytes, createHmac } = require("crypto");

const mongoose = require("mongoose");
const { createtokenforuser } = require("../service/authentication");

mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Connection error:", err));

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
    profileImageURL: { type: String, default: "/images/default.png" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

// Define a static method on the user schema to check login credentials
userSchema.static(
  "matchpasswordandgeneratetoken",
  async function (email, password) {
    // Search for a user by their email in the database
    const user = await this.findOne({ email });

    // If user with the given email is not found, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Extract the stored salt and hashed password from the found user
    const salt = user.salt;
    const hashedPassword = user.password;

    // Hash the password entered by the user using the same salt and hashing algorithm
    const userprovidedhashed = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    // Compare the stored hashed password with the one generated from the entered password
    if (hashedPassword !== userprovidedhashed) {
      throw new Error("incorrect password");
    }

    const token = createtokenforuser(user);
    return token;
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
