import { NextRequest, NextResponse } from "next/server";
import getUrlParams from "@/app/lib/get_url_params";
import getManagerTokenFromCookies from "@/app/lib/get_manager_token_from_cookies";

export const dynamic = 'force-dynamic';

// Base URL de l'API externe
const{ API_URL, APP_API_KEY } = getUrlParams();

export async function POST(request: Request) {
  const body = await request.json();
//   console.log(body);

  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "userId non fourni" }, { status: 400 });
    }

    const token = getManagerTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Token non fourni" }, { status: 401 });
    }

     const response = await fetch(`${API_URL}/admin/${userId}/events/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${APP_API_KEY}`,
        "X-Auth-Token": token,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();
    console.log(responseData);

    if (!response.ok) {
      return Response.json(
        {
          error: "Erreur lors de la création de l'emission",
          message: responseData.message,
        },
        { status: response.status }
      );
    }

    return Response.json(responseData, { status: 201 });
  } catch (e) {
    console.error("Erreur lors de la création de l'emission:", e);
    return Response.json("Erreur lors de la création de l'emission", { status: 500 });
  }
}