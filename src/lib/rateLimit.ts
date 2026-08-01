interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;

const MAX_STORE_SIZE = 10_000;

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function rateLimit(
  key: string,
  max = MAX_REQUESTS,
  windowMs = WINDOW_MS
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  if (store.size >= MAX_STORE_SIZE) {
    for (const [k, record] of store) {
      if (record.resetAt <= now) {
        store.delete(k);
      }
    }
  }

  const record = store.get(key);

  if (!record || record.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  record.count += 1;

  if (record.count > max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
