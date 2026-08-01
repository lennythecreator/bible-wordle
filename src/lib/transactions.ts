import mongoose from "mongoose";

export async function withTransaction<T>(
  fn: (session: mongoose.ClientSession) => Promise<T>
): Promise<T | null> {
  const session = await mongoose.startSession();
  try {
    let result: T | null = null;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      /Transaction numbers are only allowed on a replica set member or mongos/.test(
        message
      )
    ) {
      return null;
    }
    throw error;
  } finally {
    await session.endSession();
  }
}
