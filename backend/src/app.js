import express from "express";
import { ApiRouter } from "./routes/api/index.js";
import { errorHandler } from "./middlewares/error-handler.js";
import openapiDocument from "./docs/openapi.json";

const app = express();
app.use(express.json());

// Swagger UI
const isProd = String(process.env.PROD || "false").toLowerCase() === "true";
if (!isProd) {
  import("swagger-ui-express")
    .then((mod) => {
      const swaggerUi = mod.default;
      app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
    })
    .catch((err) => {
      console.warn(
        "swagger-ui-express not available; /api/docs disabled - ",
        err.message,
      );
    });
}

app.use("/api", ApiRouter);

app.use(errorHandler);

export default app;
