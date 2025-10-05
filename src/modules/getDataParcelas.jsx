export async function getDataParcelas() {
  try {
    const response = await fetch("https://sensores-async-api.onrender.com/api/sensors/all");

    if (!response.ok) {
      throw new Error("Error al obtener los datos de los sensores");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
