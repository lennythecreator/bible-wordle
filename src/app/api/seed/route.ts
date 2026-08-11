import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();

    if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "";
    const adminName = process.env.ADMIN_NAME || "Admin";
    const adminUsername = process.env.ADMIN_USERNAME || undefined;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set" },
        { status: 500 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      existingUser.role = "admin";
      await existingUser.save();
      return NextResponse.json({ message: "User updated to admin", user: existingUser });
    }

    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: await hashPassword(adminPassword),
      username: adminUsername,
      role: "admin",
    });

    return NextResponse.json({
      message: "Admin user created",
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        username: adminUser.username,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
