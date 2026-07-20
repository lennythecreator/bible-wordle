import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();

    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const adminData = {
      name: "Lenny",
      email: "leouwaeme@gmail.com",
      password: await hashPassword("Sonicboom123!"),
      username: "Lennyuwaeme",
      role: "admin" as const,
    };

    const existingUser = await User.findOne({ email: adminData.email });

    if (existingUser) {
      existingUser.role = "admin";
      await existingUser.save();
      return NextResponse.json({ message: "User updated to admin", user: existingUser });
    }

    const adminUser = await User.create(adminData);

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
