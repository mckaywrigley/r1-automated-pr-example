
import express, { Express } from 'express';
import winston from 'winston';
import 'express-async-handler';
import { Config } from './config';
import verifyWebhookSignature from './middleware/auth';
import webhookRouter from './routes/webhook';

const app: Express = express();

// Configure middleware
app.use(express.json());
app.use(verifyWebhookSignature);

// Routes
app.use(webhookRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  winston.error('Request failed', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = Config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
