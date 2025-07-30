import { NextRequest, NextResponse } from "next/server";
import getUrlParams from "@/app/lib/get_url_params";
import getManagerTokenFromCookies from "@/app/lib/get_manager_token_from_cookies";

export const dynamic = 'force-dynamic';

// Base URL de l'API externe
const { API_URL, APP_API_KEY } = getUrlParams();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Récupérer l'userId depuis les en-têtes
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "userId non fourni" }, { status: 400 });
    }

    // Récupérer l'ID de la phase depuis les paramètres d'URL
    const phaseId = params.id;
    if (!phaseId) {
      return NextResponse.json({ error: "ID de la phase non fourni" }, { status: 400 });
    }

    // Récupérer le token d'authentification
    const token = getManagerTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Token non fourni" }, { status: 401 });
    }

    // Appeler l'API externe pour récupérer la phase spécifique
    const response = await fetch(`${API_URL}/admin/${userId}/phases/${phaseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${APP_API_KEY}`,
        "X-Auth-Token": token,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Erreur lors de la récupération de la phase",
          message: responseData.message || "Erreur inconnue",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (e) {
    console.error("Erreur lors de la récupération de la phase:", e);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la phase" },
      { status: 500 }
    );
  }
}