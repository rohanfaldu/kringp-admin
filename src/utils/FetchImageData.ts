import { ApiResponse } from "../Types/ApiResponse";

export async function FetchImageData<T>(
    endpoint: string,
    method: string = 'POST',
    body?: any,
    headers: HeadersInit = {},
     isFormData: boolean = false 
): Promise<ApiResponse<T>> {
    const baseUrl = 'https://api.kringp.com/api';
     const requestOptions: RequestInit = {
        method,
        headers: {
            ...headers,  // Allow for custom headers to be passed in
        },
    };
     if (isFormData) {
         requestOptions.body = body;
     }else{
        if (body && method !== 'GET') {
            requestOptions.body = JSON.stringify(body);
        }
     }
    
    const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);
    console.log(response,"response");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
}