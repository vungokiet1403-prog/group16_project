const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");

// Base path được mount ở server.js: /api/users
router.get("/",    ctrl.list);           // GET    /api/users
router.post("/",   ctrl.create);         // POST   /api/users
router.put("/:id", ctrl.update);         // PUT    /api/users/:id
router.delete("/:id", ctrl.remove);      // DELETE /api/users/:id

module.exports = router;
