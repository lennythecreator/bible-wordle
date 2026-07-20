import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { user, token } = await loginUser(email, password);

    return NextResponse.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error: any) {
    if (error.message === "Invalid email or password") {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
