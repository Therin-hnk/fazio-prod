import { NextRequest, NextResponse } from "next/server";
import getUrlParams from "@/app/lib/get_url_params";
import getManagerTokenFromCookies from "@/app/lib/get_manager_token_from_cookies";

export const dynamic = 'force-dynamic';

const{ API_URL, APP_API_KEY } = getUrlParams();

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const userId = request.headers.get("x-user-id");
  const token = getManagerTokenFromCookies();

  if (!userId) {
    return NextResponse.json({ error: "userId non fourni" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "Token non fourni" }, { status: 401 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "ID à modifier non fourni" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/admin/${userId}/phases/${body.id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${APP_API_KEY}`,
        "X-Auth-Token": token,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Erreur lors de la mise à jour",
          message: responseData.message,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (e) {
    console.error("Erreur lors de la mise à jour:", e);
    return NextResponse.json("Erreur lors de la mise à jour", { status: 500 });
  }
} 