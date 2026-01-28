import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { CreatePasteRequest, Paste } from "@/lib/types";
import { generateId, getCurrentTime } from "@/lib/utils";

export async function POST(request: NextRequest) {
  //getting the content, ttl, max views

  try {
    const body: CreatePasteRequest = await request.json();

    const content = String(body?.content ?? "");
    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    if (body.ttl_seconds !== undefined) {
      if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
        return NextResponse.json(
          { error: "TTL seconds must be an integer >= 1" },
          { status: 400 },
        );
      }
    }
    if (body.max_views !== undefined) {
      if (!Number.isInteger(body.max_views) || body.max_views < 1) {
        return NextResponse.json(
          { error: "max_views must be an integer >= 1" },
          { status: 400 },
        );
      }
    }

    //after checking, create url with random id

    const id = generateId();
    const createdAt = getCurrentTime(request);

    const paste: Paste = {
      id,
      content: body.content,
      created_at: createdAt,
      ttl_seconds: body.ttl_seconds ?? null,
      max_views: body.max_views ?? null,
      view_count: 0,
    };

    const key = `paste:${id}`;
    await redis.set(key, JSON.stringify(paste));

    //ACTIVATING Redis auto-delete
    if (paste.ttl_seconds) {
      await redis.expire(key, paste.ttl_seconds);
    }
    // Build response URL
    const origin = request.headers.get("origin");
    const url = origin ? `${origin}/p/${id}` : `/p/${id}`;
    // const baseUrl = request.headers.get("host") || "localhost:3000";
    // const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    // const url = `${protocol}://${baseUrl}/p/${id}`;

    return NextResponse.json({ id, url }, { status: 201 });
  } catch (error) {
    console.log("Create paste err", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
