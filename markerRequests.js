"use strict";
const express = require("express");
const router = express.Router();
const { MarkerRequest } = require("./AplicationDbContext.js");
const { Confirmation } = require("./AplicationDbContext.js");

// Endpoint GET para obtener marcadores
// Endpoint GET para obtener marcadores
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const markerId = req.query.markerId;

    if (markerId) {
      // Buscar el marcador
      const marker = await MarkerRequest.findByPk(markerId);
      if (!marker) {
        return res.status(404).json({ error: "El marcador con el ID proporcionado no existe." });
      }

      // Buscar la última confirmación para este userId y markerId
      const lastConfirmation = await Confirmation.findOne({
        where: {
          userId: userId,
          markerId: markerId,
        },
        order: [["date", "DESC"]], // Obtener la más reciente
      });

      // Verificar si ha transcurrido al menos una hora desde la última confirmación
      if (lastConfirmation) {
        const lastConfirmationDate = new Date(lastConfirmation.date);
        const currentTime = new Date();
        const timeDifference = (currentTime - lastConfirmationDate) / (1000 * 60); // Diferencia en minutos

        if (timeDifference < 60) {
          return res.status(400).json({ error: "BadRequest due to time. Aún no ha pasado 1 hora desde la última confirmación." });
        }
      }

      // Incrementar las confirmaciones del marcador y guardar
      marker.confirmations += 1;
      await marker.save();

      // Crear una nueva confirmación
      const newConfirmation = await Confirmation.create({
        userId: userId,
        markerId: markerId,
        date: new Date().toISOString(),
      });

      return res.status(201).json(newConfirmation);
    }

    // Obtener todas las solicitudes
    if (!userId && !markerId) {
      const markerRequests = await MarkerRequest.findAll();
      return res.json(markerRequests);
    }
  } catch (err) {
    // Manejo de errores
    return res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
});



// Crear una nueva solicitud
router.post("/", async (req, res) => {
  try {
    const markerRequests = await MarkerRequest.create(req.body);
    plain: true;
    res.json(markerRequests.id);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener una solicitud por ID
router.get("/:id", async (req, res) => {
  try {
    const markerRequests = await MarkerRequest.findByPk(req.params.id);
    if (markerRequests) {
      res.json(markerRequests);
    } else {
      res.status(404).json({ error: "MarkerRequest no encontrado" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar un usuario por ID
router.put("/:id", async (req, res) => {
  try {
    const markerRequests = await MarkerRequest.findByPk(req.params.id);
    if (markerRequests) {
      await markerRequests.update(req.body);
      res.json(markerRequests);
    } else {
      res.status(404).json({ error: "MarkerRequest no encontrada" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    const markerRequests = await MarkerRequest.findByPk(req.params.id);
    if (markerRequests) {
      await markerRequests.destroy();
      res.json({ message: "Solicitud eliminada" });
    } else {
      res.status(404).json({ error: "Solicitud no encontrada" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
