// lib/stats.ts
// Simple in-memory storage for active users
// Note: In a multi-server/serverless environment, you'd use Redis or a DB.
// Since this is a single-server setup (systemd), this will work for the same Node process.

const activeUsers = new Map<string, number>();
const HEARTBEAT_TIMEOUT = 30000; // 30 seconds

export function recordHeartbeat(visitorId: string) {
  activeUsers.set(visitorId, Date.now());
}

export function getActiveUserCount() {
  const now = Date.now();
  // Clean up old heartbeats
  for (const [id, lastSeen] of activeUsers.entries()) {
    if (now - lastSeen > HEARTBEAT_TIMEOUT) {
      activeUsers.delete(id);
    }
  }
  return activeUsers.size;
}
