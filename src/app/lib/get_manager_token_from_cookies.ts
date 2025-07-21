import { cookies } from "next/headers"; // Importer cookies depuis next/headers



// Fonction pour récupérer le token depuis les cookies
const getManagerTokenFromCookies = (): string | null => {
    const token = cookies().get('managerToken')?.value;
    return token || null;
};

export default getManagerTokenFromCookies;