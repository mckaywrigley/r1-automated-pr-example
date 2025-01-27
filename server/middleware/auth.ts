
        import jwt from "jsonwebtoken";
        import { NextFunction, Request, Response } from "express";
        import winston from "winston";

        const logger = winston.createLogger({
          level: "info",
          format: winston.format.json(),
          transports: [new winston.transports.Console()],
        });

        export const authenticateWebhook = (secret: string) => {
          return (req: Request, res: Response, next: NextFunction) => {
            try {
              const signature = req.header("Google-Signature");
              const payload = req.body;
              
              if (!signature || !payload) {
                logger.warn("Missing Google-Signature header or payload");
                return res.status(401).json({ error: "Unauthorized" });
              }

              // Verify JWT signature
              const decoded = jwt.verify(payload, secret) as any;
              
              // Verify timestamp
              const now = Math.floor(Date.now() / 1000);
              if (now - decoded.iat > 300) { // 5 minute window
                logger.warn("Expired webhook signature");
                return res.status(401).json({ error: "Unauthorized" });
              }

              next();
            } catch (error) {
              logger.error("Webhook authentication failed", { error });
              return res.status(500).json({ error: "Internal Server Error" });
            }
          };
        };
      