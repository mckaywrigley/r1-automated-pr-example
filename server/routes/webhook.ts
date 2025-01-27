
import { Router } from 'express';
import { Config } from '../config';
import { GmailWebhookEvent, GmailNotificationPayload } from '../types';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

const router = Router();

router.post(Config.WEBHOOK_ENDPOINT, async (req, res) => {
  try {
    const event: GmailWebhookEvent = req.body;
    
    // Process the event
    switch (event.event.type) {
      case 'email-delivered':
        const payload = Buffer.from(event.payload, 'base64').toString();
        const notification: GmailNotificationPayload = JSON.parse(payload);
        
        // Handle the notification
        logger.info('New email delivered', {
          messageId: notification.messageId,
          threadId: notification.threadId,
        });
        
        break;
      default:
        logger.warn('Unhandled event type', { type: event.event.type });
        break;
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error('Webhook processing failed', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
