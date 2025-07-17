import { NextRequest, NextResponse } from "next/server";
import { kkiapay } from "@kkiapay-org/nodejs-sdk";

export const dynamic = 'force-dynamic';

const kk = kkiapay({
  privatekey: process.env.PRIVATE!,
  publickey: process.env.PUBLIC!,
  secretkey: process.env.SECRETE!,
  sandbox: true, // false en prod
});

export async function POST(request: Request) {
  const body = await request.json();
//   console.log(body);

  try {
    console.log(body);
    

    return Response.json({}, { status: 201 });
  } catch (e) {
    console.error("Erreur lors de la création de l'utilisateur:", e);
    return Response.json("Erreur lors de la création de l'utilisateur", { status: 500 });
  }
}