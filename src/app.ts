import "dotenv/config";
import express from "express";
import cors from "cors";

import { router } from "./routes";
import { dbConnection } from "./core/dbconfig/mariadb";
import { logMiddleware } from "./core/middleware/log.middleware";
import { errorHandlerMiddleware } from "./core/middleware/error-handler.middleware";

//import mongodb from "./config/mongo";
//import dbConnect from "./config/mongo";

const PORT = process.env.SERVER_PORT || 3001;

const app = express();
const path = require("path");

const allowedOrigins = ["http://54.70.207.245:3166", "http://localhost:4200"];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    // Permitir solicitudes sin origen (como las de herramientas como Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(logMiddleware);
app.use(router);

// Sirviendo archivos estáticos desde 'storage'
app.use("/storage", express.static(path.join(__dirname, "..", "storage")));

dbConnection().then(() => {});

// Middleware de manejo de errores
app.use(errorHandlerMiddleware);

// Escuchar en todas las interfaces
/* app.listen(3165, "0.0.0.0", () => {
  console.log("Server is running on http://0.0.0.0:3165");
}); */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// manejo de errores no capturados
process.on("uncaughtException", (error) => {
  console.error("Excepción no capturada:", error);
  // Manejo del error: registrar, limpiar recursos, reiniciar la aplicación si es necesario, etc.

  process.exit(1);

  //pm2 start app.ts --name="mi-aplicacion"
});
