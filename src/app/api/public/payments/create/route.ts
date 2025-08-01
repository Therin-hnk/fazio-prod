import getUrlParams from "@/app/lib/get_url_params";

export const dynamic = 'force-dynamic';

// Base URL de l'API externe
const{ API_URL, NEXT_PUBLIC_API_KEY } = getUrlParams();

export async function POST(request: Request) {
  const body = await request.json();

  try {
     const response = await fetch(`${API_URL}/public/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    const responseData = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error: "Erreur lors de la création du paiement",
          message: responseData.message,
        },
        { status: response.status }
      );
    }

    return Response.json(responseData, { status: 201 });
  } catch (e) {
    console.error("Erreur lors de la création du paiement:", e);
    return Response.json("Erreur lors de la création du paiement", { status: 500 });
  }
}