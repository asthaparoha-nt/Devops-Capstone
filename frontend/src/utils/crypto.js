import CryptoJS from "crypto-js";

const SECRET_KEY = "AssessmentPortal@2026";

export function encryptPassword(password) {

    return CryptoJS.AES.encrypt(

        password,

        SECRET_KEY

    ).toString();

}