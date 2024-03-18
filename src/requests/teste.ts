import api_client from "@/config/api_client";

export async function postConstruction(teste:any){
    
    const { data } = await api_client.post(`/worksmanagement`, {
        obra: teste
    })
  
    return data;
  
  }