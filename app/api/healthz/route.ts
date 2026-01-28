import { NextRequest, NextResponse } from "next/server";
//eqv to (req,res) in express

import { redis } from "@/lib/redis";

export async function GET(request: NextRequest) {
  try {
    await redis.ping();

    return NextResponse.json(
      { ok: true },
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
