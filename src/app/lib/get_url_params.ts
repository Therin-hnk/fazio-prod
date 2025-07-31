const getUrlParams=()=>{
    const API_URL = process.env.API_URL || "https://external-api.com";
    const APP_API_KEY = process.env.APP_API_KEY || "<votre_app_key>";
    const NEXT_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const FEDAPAY_SECRET_KEY = process.env.FEDAPAY_SECRET_KEY || "<votre_fedapay_secret_key>";

    return {
        API_URL,
        APP_API_KEY,
        NEXT_PUBLIC_API_KEY,
        FEDAPAY_SECRET_KEY
    }
}
export default getUrlParams;