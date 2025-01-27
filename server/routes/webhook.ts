
        import { Router } from "express";
        import { Notification } from "./types";
        import winston from "winston";

        const router = Router();
        const logger = winston.createLogger({
          level: "info",
          format: winston.format.json(),
          transports: [new winston.transports.Console()],
        });

        router.post("/", async (req, res) => {
          try {
            const notification: Notification = req.body;
            logger.info("Received notification", { notification });

            switch (notification.event_type) {
              case "message_delivered":
                handleDelivered(notification);
                break;
              case "message_read":
                handleRead(notification);
                break;
              case "message_moved":
                handleMoved(notification);
                break;
              default:
                logger.warn("Unknown event type", { event_type: notification.event_type });
                return res.status(400).json({ error: "Unknown event type" });
            }

            res.status(200).json({ status: "ok" });
          } catch (error) {
            logger.error("Webhook processing failed", { error });
            res.status(500).json({ error: "Internal Server Error" });
          }
        });

        function handleDelivered(notification: Notification) {
          logger.info("Message delivered", {
            message_id: notification.message_id,
            metadata: notification.metadata
          });
          // Implement your delivery handling logic here
        }

        function handleRead(notification: Notification) {
          logger.info("Message read", {
            message_id: notification.message_id,
            metadata: notification.metadata
          });
          // Implement your read handling logic here
        }

        function handleMoved(notification: Notification) {
          logger.info("Message moved", {
            message_id: notification.message_id,
            metadata: notification.metadata
          });
          // Implement your moved handling logic here
        }

        export default router;
      