import { apiResponseHandler } from "@/lib/apiResponse";

export const createAccount = async(userId:string,lastName:string,firstName:string,email:string | null)=>{
    const requestBody = {
        userId: userId,
        lastName: lastName,
        firstName: firstName,
        email: email
    };
    console.log(process.env.API_SERVER_DOMAIN)
    const rawResult = await fetch(
        "http://localhost:8000/" + "account-init",
        {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), 
        }
    );

    const result = await apiResponseHandler(rawResult);
    return result;
}