import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const PORT = process.env.PORT || 3000;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "An e-commerce backend built with Express, TypeScript and MongoDB",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [path.join(__dirname, "../routes/*.{ts,js}").replace(/\\/g, "/")],
};

export const swaggerSpec = swaggerJsdoc(options);