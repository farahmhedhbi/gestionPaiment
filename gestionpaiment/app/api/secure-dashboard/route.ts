import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // lire les cookies depuis la requête
    const sessionCookie = req.cookies.get("JSESSIONID");

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authenticated: true },
      { status: 200 }
    );

  } catch (err) {
    console.error("Erreur secure-dashboard:", err);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}
