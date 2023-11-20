class Calculador {
  calcularCaracteristicas(datosentrada) {

// Filtrar datos válidos
const datos = datosentrada.filter(dato => dato.timestamp >= 0 && dato.timestamp < 7);
const ventanaDatosCuartoSegundo = datos.filter(dato => dato.timestamp >= 4 && dato.timestamp < 5);

// Imprimir los datos capturados para depuración
console.log('Datos capturados calculador:', datos);

// Verificar si hay suficientes datos
if (ventanaDatosCuartoSegundo.length === 0 || datos.length === 0) {
  console.error('No hay suficientes datos para realizar los cálculos.');
  return [];
}
    // Cálculos de magnitudes de aceleración y giroscopio
    const magnitudesAceleracion = ventanaDatosCuartoSegundo.map(dato => this.calcularMagnitud({ x: dato.acc_x, y: dato.acc_y, z: dato.acc_z }));
    const acc_max = Math.max(...magnitudesAceleracion);

    const magnitudesGiroscopio = ventanaDatosCuartoSegundo.map(dato => this.calcularMagnitud({ x: dato.gyro_x, y: dato.gyro_y, z: dato.gyro_z }));
    const gyro_max = Math.max(...magnitudesGiroscopio);

    // Cálculos de magnitudes de aceleración y giroscopio de toda la ventana
    const magnitudesAceleracionDeTodaLaventana = datos.map(dato => this.calcularMagnitud({ x: dato.acc_x, y: dato.acc_y, z: dato.acc_z }));
    const magnitudesGyroscopioDeTodaLaventana = datos.map(dato => this.calcularMagnitud({ x: dato.gyro_x, y: dato.gyro_y, z: dato.gyro_z }));

    // Cálculos de curtosis y asimetría de aceleración
    const acc_kurtosis = this.calcularCurtosis(magnitudesAceleracionDeTodaLaventana);
    const acc_skewness = this.calcularAsimetria(magnitudesAceleracionDeTodaLaventana);

    // Cálculos de curtosis y asimetría de giroscopio
    const gyro_kurtosis = this.calcularCurtosis(magnitudesGyroscopioDeTodaLaventana);
    const gyro_skewness = this.calcularAsimetria(magnitudesGyroscopioDeTodaLaventana);

    // Cálculos de otras características
    const linMaxValue = this.calcularLinMax(datos);
    const postLinMaxValue = this.calcularPostLinMax(datos);
    const postGyroMaxValue = this.calcularPostGyroMax(datos);

    // Cálculos de magnitudes del magnetómetro
    const magnitudesMagnetometroDeTodaLaventana = datos.map(dato => this.calcularMagnitud({ x: dato.mag_x, y: dato.mag_y, z: dato.mag_z }));
    const magnitudesMagnetometro = ventanaDatosCuartoSegundo.map(dato => this.calcularMagnitud({ x: dato.mag_x, y: dato.mag_y, z: dato.mag_z }));
    const postMagMaxValue = this.calcularPostMagMax(datos);
    const mag_max = Math.max(...magnitudesMagnetometro);

    // Cálculos de curtosis y asimetría del magnetómetro
    const mag_curtosis = this.calcularCurtosis(magnitudesMagnetometroDeTodaLaventana);
    const mag_skewness = this.calcularAsimetria(magnitudesMagnetometroDeTodaLaventana);

    // Almacenar resultados en el arreglo campos
    const campos = [
      acc_max,
      acc_kurtosis,
      acc_skewness,
      gyro_max,
      gyro_kurtosis,
      gyro_skewness,
      linMaxValue,
      postLinMaxValue,
      postGyroMaxValue,
      postMagMaxValue,
      mag_max,
      mag_curtosis,
      mag_skewness,
    ];

    return campos;
  }

  calcularMagnitud(vector) {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
  }

  calcularCurtosis(datos) {
    const n = datos.length;
    const media = datos.reduce((sum, val) => sum + val, 0) / n;
    const sumatoria4 = datos.reduce((sum, val) => sum + Math.pow(val - media, 4), 0);
    const desviacionEstandar = Math.sqrt(sumatoria4 / n);
    const curtosis = sumatoria4 / (n * Math.pow(desviacionEstandar, 4)) - 3;

    return curtosis;
  }

  calcularAsimetria(datos) {
    const n = datos.length;
    const media = datos.reduce((sum, val) => sum + val, 0) / n;
    const sumatoria3 = datos.reduce((sum, val) => sum + Math.pow(val - media, 3), 0);
    const desviacionEstandar = Math.sqrt(datos.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / n);
    const asimetria = sumatoria3 / (n * Math.pow(desviacionEstandar, 3));
    return asimetria;
  }

  calcularLinMax(datos) {
    const gravedad = 9.81; // Valor aproximado de la gravedad en m/s²

    let lin_max = 0; // Inicializar en 0

    for (const fila of datos) {
      const acc_magnitud = this.calcularMagnitud({
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
  }

  calcularPostLinMax(datos) {
    let post_lin_max = 0; // Inicializar en 0

    for (const fila of datos) {
      const acc_magnitud = this.calcularMagnitud({
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
  }

  calcularPostGyroMax(datos) {
    let post_gyro_max = 0; // Inicializar en 0

    for (const fila of datos) {
      const gyro_magnitud = this.calcularMagnitud({
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
  }

  calcularPostMagMax(datos) {
    let post_mag_max = 0; // Inicializar en 0

    for (const fila of datos) {
      const mag_magnitud = this.calcularMagnitud({
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
  }
}

module.exports = Calculador;
