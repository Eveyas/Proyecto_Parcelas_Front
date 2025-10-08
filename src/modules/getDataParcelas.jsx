import { sensorService } from './apiService';

export async function getDataParcelas() {
  try {
    const currentData = await sensorService.getDatosActuales();
    
    if (currentData.success && currentData.data) {
      return transformToFrontendFormat(currentData.data);
    }
    
    throw new Error('No se pudieron obtener datos actuales');
    
  } catch (error) {
    console.error('Error en getDataParcelas:', error);
    
    try {
      const historico = await sensorService.getDatosHistoricos('temperatura', 1);
      if (historico.success && historico.data.length > 0) {
        return createFallbackData(historico.data);
      }
    } catch (fallbackError) {
      console.error('Error en fallback:', fallbackError);
    }
    
    throw error;
  }
}

function transformToFrontendFormat(apiData) {
  console.log('Datos recibidos de API:', apiData);  
  const transformSensor = (sensorData, tipo) => {
    if (!sensorData) return [];
      return [{
      value: sensorData.valor,
      timestamp: sensorData.timestamp,
      tipo_sensor: tipo,
      unidad: sensorData.unidad
    }];
  };

  return {
    temperatura: transformSensor(apiData.temperatura, 'temperatura'),
    humedad: transformSensor(apiData.humedad, 'humedad'),
    lluvia: transformSensor(apiData.lluvia, 'lluvia'),
    radiacion_solar: transformSensor(apiData.radiacion, 'radiacion')
  };
}

function createFallbackData(historicoData) {
  const lastReadings = {};
  const tipos = ['temperatura', 'humedad', 'lluvia', 'radiacion'];
  
  tipos.forEach(tipo => {
    const datosTipo = historicoData.filter(item => item.tipo_sensor === tipo);
    if (datosTipo.length > 0) {
      lastReadings[tipo] = [{
        value: datosTipo[0].valor,
        timestamp: datosTipo[0].timestamp
      }];
    }
  });
  
  return lastReadings;
}