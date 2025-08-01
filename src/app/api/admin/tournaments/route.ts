import { NextRequest, NextResponse } from "next/server";
import getUrlParams from "@/app/lib/get_url_params";
import getManagerTokenFromCookies from "@/app/lib/get_manager_token_from_cookies";

export const dynamic = 'force-dynamic';

// Base URL de l'API externe
const{ API_URL, APP_API_KEY } = getUrlParams();

export async function GET(request: Request) {

  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "userId non fourni" }, { status: 400 });
    }

    const token = getManagerTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Token non fourni" }, { status: 401 });
    }

    console.log("Récupération des utilisateurs pour l'ID:", userId);
    console.log("Token utilisé:", token);
    console.log("API_URL:", API_URL);
    console.log("APP_API_KEY:", APP_API_KEY);

    const response = await fetch(`${API_URL}/admin/${userId}/tournaments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${APP_API_KEY}`,
        "X-Auth-Token": token,
      },
    });

    // console.log(response.status, response.statusText);

    const responseData = await response.json();
    console.log(responseData);

    if (!response.ok) {
      return Response.json(
        {
          error: "Erreur lors de la récupération des utilisateurs",
          message: responseData.message,
        },
        { status: response.status }
      );
    }

    return Response.json(responseData, { status: 200 });
  } catch (e) {
    console.error("Erreur lors de la récupération des utilisateurs:", e);
    return Response.json("Erreur lors de la récupération des utilisateurs", { status: 500 });
  }
}