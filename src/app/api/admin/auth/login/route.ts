export async function POST(request: Request) {
  const { email, password } = await request.json();
  const API_URL = process.env.API_URL;

  try {
    const payload = { email, password };
    console.log(payload);
    console.log(process.env.NEXT_PUBLIC_API_KEY);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      return Response.json(
        {
          error: "Erreur lors de la connexion",
          message: responseData.message,
        },
        { status: response.status }
      );
    }

    const { userId, token, roleName } = responseData;

    return Response.json(
      {
        userId,
        token,
        roleName,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Something went wrong when login", e);
    return Response.json("Erreur lors de la connexion", { status: 500 });
  }
}
