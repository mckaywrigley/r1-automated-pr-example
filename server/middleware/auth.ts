
import { NextFunction, Request, Response } from 'express';
import { verifyIdToken } from 'google-auth-library';
import { Config } from './config';

async function verifyWebhookSignature(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-goog-signature'] as string;
    const payload = req.body;
    
    // Verify JWT signature
    const verified = await verifyIdToken({
      idToken: signature,
      audience: Config.GOOGLE_WEBHOOK_SECRET,
    });

    if (!verified) {
      throw new Error('Invalid webhook signature');
    }

    next();
  } catch (error) {
    console.error('Webhook verification failed:', error);
    res.status(401).json({ error: 'Invalid webhook signature' });
  }
}

export default verifyWebhookSignature;
