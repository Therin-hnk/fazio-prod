import { NextRequest, NextResponse } from "next/server";
import getUrlParams from "@/app/lib/get_url_params";
import getManagerTokenFromCookies from "@/app/lib/get_manager_token_from_cookies";

export const dynamic = 'force-dynamic';

// Base URL de l'API externe
const{ API_URL, NEXT_PUBLIC_API_KEY } = getUrlParams();

export async function GET(request: Request) {

  try {
    // console.log("API_URL:", API_URL);
    // console.log("APP_API_KEY:", NEXT_PUBLIC_API_KEY );

    const response = await fetch(`${API_URL}/public/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NEXT_PUBLIC_API_KEY}`,
      },
    });

    // console.log(response.status, response.statusText);

    const responseData = await response.json();
    // console.log(responseData);

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