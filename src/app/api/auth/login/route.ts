import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const { allowed, retryAfterSeconds } = rateLimit(`login:${ip}`);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        }
      );
    }

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "Invalid email or password") {
      return NextResponse.json(
        { error: message },
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
