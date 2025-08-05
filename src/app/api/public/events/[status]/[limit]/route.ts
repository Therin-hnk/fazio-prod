import { NextRequest, NextResponse } from "next/server";
import getUrlParams from "@/app/lib/get_url_params";
import getManagerTokenFromCookies from "@/app/lib/get_manager_token_from_cookies";

export const dynamic = 'force-dynamic';

// Base URL de l'API externe
const{ API_URL, NEXT_PUBLIC_API_KEY } = getUrlParams();

export async function GET(
  req: NextRequest,
  { params }: { params: { status: string, limit: Number } }
) {
  try {
    const response = await fetch(`${API_URL}/public/events?status=${params.status}&limit=${params.limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NEXT_PUBLIC_API_KEY}`,
        cache: "no-store"
      },
    });

    const responseData = await response.json();
    
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