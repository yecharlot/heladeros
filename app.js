const path=require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app=express();
const { MarkerRequest } = require("./AplicationDbContext.js");
const { Confirmation } = require("./AplicationDbContext.js");

// Middleware para parsear JSON en las solicitudes POST
app.use(express.json({ limit: '10mb' })); // Ajusta el límite si las imágenes son grandes

//Servicio corriendo cada 1 min
setInterval(async () => {
  console.log("Iniciando verificación de marcadores...");

  try {
    const markers = await MarkerRequest.findAll(); // Obtener todos los marcadores
    const currentTime = new Date();

    for (const marker of markers) {
      const lastUpdated = new Date(marker.updatedAt);
      const timeDifference = (currentTime - lastUpdated) / (1000 * 60); // Diferencia en minutos

      if (timeDifference > 10) {
        if (marker.confirmations > 1) {
          // Reducir confirmations en 1
          marker.confirmations -= 1;
          await marker.save();
          console.log(`Marcador con ID ${marker.id} actualizado. confirmations reducido a ${marker.confirmations}`);
        } else if (marker.confirmations === 1) {
          // Eliminar confirmaciones antes de eliminar el marcador
          await Confirmation.destroy({ where: { markerId: marker.id } });

          // Ahora eliminar el marcador
          await marker.destroy();
          console.log(`Marcador con ID ${marker.id} eliminado.`);
        }
      }
    }

    console.log("Verificación de marcadores completada.");
  } catch (err) {
    console.error("Error durante la verificación de marcadores:", err.message);
  }
}, 60000); // Ejecutar cada minuto

//Importando los archivos para definir las rutas
const routes = require('./index');
const users = require('./users');
const markerRequests = require('./markerRequests');
const confirmations = require('./confirmations');

// Crear la carpeta "public" si no existe
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Configurar carpeta pública para contenido estático
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

//Definiendo las rutas para los endpoints
app.use('/', routes);
app.use('/users', users);
app.use('/markerRequests',markerRequests);
app.use('/confirmations',confirmations);


const hostname = "0.0.0.0";
const port = 3000;


app.listen(port,hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});