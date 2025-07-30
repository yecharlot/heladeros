"use strict";
const express = require("express");
const router = express.Router();
const { User } = require("./AplicationDbContext.js");

// Obtener todos los usuarios
/*router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});*/


// Endpoint GET para obtener usuarios o autenticar
router.get("/", async (req, res) => {
  try {
    const userName = req.query.userName;
    //const key = req.query.key;

    if (userName) {
      // Autenticación: buscar usuario por userName
      const user = await User.findOne({ where: { userName: userName} });
      
      if (user) {
        // Si el usuario existe, devolver su ID
        //OAuth(val userId,val key)
               
        return res.json({"userId":user.id,"key":user.key });
      } else {
        // Si no se encuentra, devolver error 404
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      // Obtener todos los usuarios
      const users = await User.findAll();
      return res.json(users);
    }
  } catch (err) {
    // Manejo de errores
    return res.status(500).json({ error: err.message });
  }
});


// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    // Crear un nuevo usuario
    const user = await User.create(req.body);
    plain: true;
    res.json(user.id);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar un usuario por ID
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: "Usuario eliminado" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
