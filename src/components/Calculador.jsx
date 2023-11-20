// Cálculo de la magnitud
export const calcularMagnitud = (vector) => {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
  };
  
  // Cálculo de la curtosis
  export const calcularCurtosis = (datos) => {
    const n = datos.length;
    const media = datos.reduce((sum, val) => sum + val, 0) / n;
    const sumatoria4 = datos.reduce((sum, val) => sum + Math.pow(val - media, 4), 0);
    const desviacionEstandar = Math.sqrt(sumatoria4 / n);
    const curtosis = sumatoria4 / (n * Math.pow(desviacionEstandar, 4)) - 3;
  
    return curtosis;
  };
  
  // Cálculo de la asimetría
  export const calcularAsimetria = (datos) => {
    const n = datos.length;
    const media = datos.reduce((sum, val) => sum + val, 0) / n;
    const sumatoria3 = datos.reduce((sum, val) => sum + Math.pow(val - media, 3), 0);
    const desviacionEstandar = Math.sqrt(datos.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / n);
    const asimetria = sumatoria3 / (n * Math.pow(desviacionEstandar, 3));
  
    return asimetria;
  };
  
  // Cálculo de lin_max
  export const calcularLinMax = (datos) => {
    const gravedad = 9.81; // Valor aproximado de la gravedad en m/s²
    let lin_max = 0; // Inicializar en 0
  
    for (const fila of datos) {
      const acc_magnitud = calcularMagnitud({
        x: fila.acc_x,
        y: fila.acc_y,
        z: fila.acc_z
      });
  
      // Excluir la gravedad restando el valor estimado de gravedad
      const acc_excluyendo_gravedad = Math.max(0, acc_magnitud - gravedad);
  
      // Para calcular lin_max (Máxima aceleración lineal en el 4to segundo) excluyendo la gravedad
      if (fila.timestamp >= 4 && fila.timestamp < 5) {
        if (acc_excluyendo_gravedad > lin_max) {
          lin_max = acc_excluyendo_gravedad;
        }
      }
    }
  
    return lin_max;
  };
  
  // Cálculo de post_lin_max
  export const calcularPostLinMax = (datos) => {
    let post_lin_max = 0; // Inicializar en 0
  
    for (const fila of datos) {
      const acc_magnitud = calcularMagnitud({
        x: fila.acc_x,
        y: fila.acc_y,
        z: fila.acc_z
      });
  
      // Para calcular post_lin_max (Máxima aceleración lineal en el 6to segundo)
      if (fila.timestamp >= 6 && fila.timestamp < 7) {
        if (acc_magnitud > post_lin_max) {
          post_lin_max = acc_magnitud;
        }
      }
    }
  
    return post_lin_max;
  };
  
  // Cálculo de post_gyro_max
  export const calcularPostGyroMax = (datos) => {
    let post_gyro_max = 0; // Inicializar en 0
  
    for (const fila of datos) {
      const gyro_magnitud = calcularMagnitud({
        x: fila.gyro_x,
        y: fila.gyro_y,
        z: fila.gyro_z
      });
  
      // Para calcular post_gyro_max (Máxima magnitud del giroscopio en el 6to segundo)
      if (fila.timestamp >= 6 && fila.timestamp < 7) {
        if (gyro_magnitud > post_gyro_max) {
          post_gyro_max = gyro_magnitud;
        }
      }
    }
  
    return post_gyro_max;
  };
  
  // Cálculo de post_mag_max
  export const calcularPostMagMax = (datos) => {
    let post_mag_max = 0; // Inicializar en 0
  
    for (const fila of datos) {
      const mag_magnitud = calcularMagnitud({
        x: fila.mag_x,
        y: fila.mag_y,
        z: fila.mag_z
      });
  
      // Para calcular post_mag_max (Máxima magnitud del magnetómetro en el 6to segundo)
      if (fila.timestamp >= 6 && fila.timestamp < 7) {
        if (mag_magnitud > post_mag_max) {
          post_mag_max = mag_magnitud;
        }
      }
    }
  
    return post_mag_max;
  };
  