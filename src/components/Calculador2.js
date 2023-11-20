
class Calculador{
   calcularCaracteristicas(datosentrada) {


const datos=datosentrada.filter(dato => dato.timestamp >= 0 && dato.timestamp <7);
const ventanaDatosCuartoSegundo =datos.filter(dato => dato.timestamp >= 4 && dato.timestamp <5);

const magnitudesAceleracion = [];
for (const dato of ventanaDatosCuartoSegundo) {
  const magnitud = this.calcularMagnitud({ x: dato.acc_x, y: dato.acc_y, z: dato.acc_z });
  magnitudesAceleracion.push(magnitud);
}



// Cálculo de máxima magnitud de giroscopio
const acc_max = Math.max(...magnitudesAceleracion);



const magnitudesGiroscopio = [];
for (const dato of ventanaDatosCuartoSegundo) {
  const magnitud = this.calcularMagnitud({ x: dato.gyro_x, y: dato.gyro_y, z: dato.gyro_z });
  magnitudesGiroscopio.push(magnitud);
}

// Cálculo de magnitudes de aceleración
const magnitudesAceleracionDeTodaLaventana = [];
for (const dato of datos) {
  const magnitud = this.calcularMagnitud({ x: dato.acc_x, y: dato.acc_y, z: dato.acc_z });
  magnitudesAceleracionDeTodaLaventana.push(magnitud);
}

// Cálculo de magnitudes de giroscopio
const magnitudesGyroscopioDeTodaLaventana = [];
for (const dato of datos) {
  const magnitud = this.calcularMagnitud({ x: dato.gyro_x, y: dato.gyro_y, z: dato.gyro_z });
  magnitudesGyroscopioDeTodaLaventana.push(magnitud);
}

// Cálculo de curtosis y asimetría de aceleración
const acc_kurtosis = this.calcularCurtosis(magnitudesAceleracionDeTodaLaventana);
const acc_skewness = this.calcularAsimetria(magnitudesAceleracionDeTodaLaventana);

// Cálculo de máxima magnitud de giroscopio
const gyro_max = Math.max(...magnitudesGiroscopio);



const gyro_kurtosis = this.calcularCurtosis(magnitudesGyroscopioDeTodaLaventana);
const gyro_skewness = this.calcularAsimetria(magnitudesGyroscopioDeTodaLaventana);
const linMaxValue = this.calcularLinMax(datos);
const postLinMaxValue = this.calcularPostLinMax(datos);
const postGyroMaxValue = this.calcularPostGyroMax(datos);


    // Cálculo de magnitudes del magnetómetro
    const
     magnitudesMagnetometroDeTodaLaventana = [];
    for (const dato of datos) {
      const magnitud = this.calcularMagnitud({ x: dato.mag_x, y: dato.mag_y, z: dato.mag_z });
      magnitudesMagnetometroDeTodaLaventana.push(magnitud);
    }

const magnitudesMagnetometro = [];
for (const dato of ventanaDatosCuartoSegundo) {
  const magnitud = this.calcularMagnitud({ x: dato.mag_x, y: dato.mag_y, z: dato.mag_z });
  magnitudesMagnetometro.push(magnitud);
}

const postMagMaxValue = this.calcularPostMagMax(datos);
const mag_max = Math.max(...magnitudesMagnetometro);



    // Cálculo de curtosis del magnetómetro
    const mag_curtosis = this.calcularCurtosis(magnitudesMagnetometroDeTodaLaventana);

    // Cálculo de asimetría (skewness) del magnetómetro
    const mag_skewness = this.calcularAsimetria(magnitudesMagnetometroDeTodaLaventana);


    const campos = [
      acc_max.toFixed(15),
      acc_kurtosis.toFixed(15),
      acc_skewness.toFixed(15),
      gyro_max.toFixed(15),
      gyro_kurtosis.toFixed(15),
      gyro_skewness.toFixed(15),
      linMaxValue.toFixed(15),
      postLinMaxValue.toFixed(15),
      postGyroMaxValue.toFixed(15),
      postMagMaxValue.toFixed(15),
      mag_max.toFixed(15),
      mag_curtosis.toFixed(15),
      mag_skewness.toFixed(15),
    ];

    return campos;;


  }
 calcularMagnitud(vector) {
return Math.sqrt(vector.x ** 2 + vector.y **2 + vector.z ** 2);
}

// Función para calcular la curtosis de un conjunto de datos
 calcularCurtosis(datos) {



const n = datos.length;

const media = datos.reduce((sum, val) => sum + val, 0) / n;
const sumatoria4 = datos.reduce((sum, val) => sum + Math.pow(val - media, 4), 0);
const desviacionEstandar = Math.sqrt(sumatoria4 / n);
const curtosis = sumatoria4 / (n * Math.pow(desviacionEstandar, 4))-3;

return curtosis;
}

// Función para calcular la asimetría de un conjunto de datos
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


// Función para calcular post_lin_max
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

// Función para calcular post_gyro_max
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





// Función para calcular post_mag_max
calcularPostMagMax(datos) {
  

    let post_mag_max = 0; // Inicializar en 0
    
    for (const fila of datos) {
    const mag_magnitud = this.calcularMagnitud({
      x: fila.mag_x,
      y: fila.mag_y,
      z: fila.mag_z
    });
    
    // Para calcular post_gyro_max (Máxima magnitud del giroscopio en el 6to segundo)
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


const datos = [
    { timestamp: 1, acc_x: 0.2, acc_y: 1, acc_z: 1, gyro_x: 0.1, gyro_y: 0.5, gyro_z: 0.9 , mag_x: 0.1, mag_y: 0.5, mag_z: 0.9 },
    { timestamp: 2, acc_x: 0.3, acc_y: 1, acc_z: 1, gyro_x: 0.1, gyro_y: 0.5, gyro_z: 0.9 , mag_x: 0.1, mag_y: 0.5, mag_z: 0.9 },
    { timestamp: 3, acc_x: 0.2, acc_y: 1, acc_z: 1, gyro_x: 0.1, gyro_y: 0.5, gyro_z: 0.9 , mag_x: 0.1, mag_y: 0.5, mag_z: 0.9 },
    { timestamp: 4, acc_x: 0.2, acc_y: 1, acc_z: 1, gyro_x: 0.1, gyro_y: 0.5, gyro_z: 0.9 , mag_x: 0.1, mag_y: 0.5, mag_z: 0.9 },
    { timestamp: 5, acc_x: 0.2, acc_y: 1, acc_z: 1, gyro_x: 0.1, gyro_y: 0.5, gyro_z: 0.9, mag_x: 0.1, mag_y: 0.5, mag_z: 0.9 },
    { timestamp: 6, acc_x: 0.2, acc_y: 1, acc_z: 1, gyro_x: 0.1, gyro_y: 0.5, gyro_z: 0.9 , mag_x: 0.1, mag_y: 0.5, mag_z: 0.9 },
   
  ];

  const algoritmo = new Calculador();
  

  const caracteristicas = algoritmo.calcularCaracteristicas(datos);
  console.log(caracteristicas);

