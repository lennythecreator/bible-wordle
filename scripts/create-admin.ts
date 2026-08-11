import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bible-wordle";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || undefined;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  username: { type: String, unique: true, sparse: true, trim: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    if (!ADMIN_EMAIL) {
      console.error("ADMIN_EMAIL environment variable is required.");
      process.exit(1);
    }
    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD environment variable is required for new accounts.");
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({ email: ADMIN_EMAIL });

    if (existingUser) {
      console.log("User already exists. Updating role to admin...");
      existingUser.role = "admin";
      await existingUser.save();
      console.log("User updated to admin!");
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

      const adminUser = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        username: ADMIN_USERNAME,
        role: "admin",
      });

      console.log("Admin user created successfully!");
      console.log({
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        username: adminUser.username,
        role: adminUser.role,
      });
    }

    await mongoose.disconnect();
    console.log("Done!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAdmin();
