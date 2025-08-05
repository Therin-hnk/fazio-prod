import { NextRequest, NextResponse } from "next/server";
import getUrlParams from "@/app/lib/get_url_params";
import getManagerTokenFromCookies from "@/app/lib/get_manager_token_from_cookies";

export const dynamic = 'force-dynamic';

const{ API_URL, APP_API_KEY } = getUrlParams();

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const userId = request.headers.get("x-user-id");
  const token = getManagerTokenFromCookies();

  if (!userId) {
    return NextResponse.json({ error: "userId non fourni" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "Token non fourni" }, { status: 401 });
  }

  if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: "Tableau d'IDs non fourni ou vide" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/admin/${userId}/events/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${APP_API_KEY}`,
        "X-Auth-Token": token,
      },
      body: JSON.stringify({eventIds:  body.ids}),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Erreur lors de la suppression des evenements",
          message: responseData.message,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (e) {
    console.error("Erreur lors de la suppression des evenements:", e);
    return NextResponse.json("Erreur lors de la suppression des evenements", { status: 500 });
  }
}