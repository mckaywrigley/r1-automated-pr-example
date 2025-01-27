
        import express from "express";
        import dotenv from "dotenv";
        import winston from "winston";
        import config from "./config";
        import webhookRouter from "./routes/webhook";
        import authenticateWebhook from "./middleware/auth";

        const app = express();
        const logger = winston.createLogger({
          level: "info",
          format: winston.format.json(),
          transports: [new winston.transports.Console()],
        });

        // Load environment variables
        dotenv.config();

        // Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Webhook route with authentication
        app.use("/webhook", authenticateWebhook(config.webhookSecret), webhookRouter);

        // Error handling middleware
        app.use((err: Error, req: any, res: any, next: any) => {
          logger.error(err.message, err);
          res.status(500).json({ error: "Internal Server Error" });
        });

        // Start server
        const port = config.port || 3000;
        app.listen(port, () => {
          logger.info(`Server running on port ${port}`);
        });
      