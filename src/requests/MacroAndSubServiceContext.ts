import api_client from "@/config/api_client";

export async function userRegister() {
  const { data } = await api_client.get("/macroservices");
  return data;
}

export async function findSubservice() {
  const { data } = await api_client.get(`/subservices`);
  return data;
}
