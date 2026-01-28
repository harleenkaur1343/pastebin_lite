//dynamic route
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getCurrentTime } from "@/lib/utils";
import { Paste, GetPasteResponse } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const key = `paste:${id}`;

    const data = await redis.get(key);

    if (!data) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }
    //no need to stringify when using the upstash
    //const paste: Paste = JSON.parse(data as string);

    const paste = data as Paste;
    const currentTime = getCurrentTime(request);

    // Check if paste is expired (time-based)
    if (paste.ttl_seconds) {
      const expiresAt = paste.created_at + paste.ttl_seconds * 1000;
      if (currentTime >= expiresAt) {
        // Delete expired paste
        await redis.del(key);
        return NextResponse.json(
          { error: "Paste has expired" },
          { status: 404 },
        );
      }
    }

    // Check if paste has exceeded view limit
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      return NextResponse.json(
        { error: "Paste not found. Max_views limit reached" },
        { status: 404 },
      );
    }

    // Increment view count
    paste.view_count += 1;
    await redis.set(key, paste);

    // If we've now hit the max views, delete the paste
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      await redis.del(key);
    }

    // Calculate remaining views
    const remaining_views =
      paste.max_views !== null ? paste.max_views - paste.view_count : null;

    // Calculate expires_at
    const expires_at = paste.ttl_seconds
      ? new Date(paste.created_at + paste.ttl_seconds * 1000).toISOString()
      : null;

    const response: GetPasteResponse = {
      content: paste.content,
      remaining_views,
      expires_at,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 });
  }
}
