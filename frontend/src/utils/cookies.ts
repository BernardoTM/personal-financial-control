import Cookies from "js-cookie";

export function addCookies(token_type: string, refresh_token: string, access_token: string) {
    const expirationDateToken = new Date();
    const expirationDateRefreshToken = new Date();

    expirationDateRefreshToken.setTime(
        expirationDateRefreshToken.getTime() + 7 * 24 * 60 * 60 * 1000,
    ); // 7 dias em milissegundos

    expirationDateToken.setTime(
        expirationDateToken.getTime() + 30 * 60 * 1000,
    ); // 30 minutos em milissegundos

    Cookies.set(
        "refreshToken",
        JSON.stringify({
        authorization: `${token_type} ${refresh_token}`,
        }),
        { expires: expirationDateRefreshToken },
    );

    Cookies.set(
        "accessToken",
        JSON.stringify({
        authorization: `${token_type} ${access_token}`,
        }),
        { expires: expirationDateToken },
    );
}


export function removeCookies() {
    Cookies.remove("accessToken")
    //Cookies.remove("refreshToken")
} 