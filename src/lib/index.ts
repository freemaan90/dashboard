export const api = async (
  endpoint: string,
  method: string,
  data?: any,
  accessToken?: string,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error en la solicitud");
  }

  return res.json();
}