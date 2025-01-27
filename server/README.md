
# Gmail Webhook Server

A production-ready Express server for handling Gmail API push notifications.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install express google-auth-library winston dotenv typescript ts-node
   ```
3. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Configuration

The server uses the following environment variables:

- `PORT`: Server port (default: 3000)
- `GOOGLE_WEBHOOK_SECRET`: Your Google webhook secret key
- `WEBHOOK_ENDPOINT`: Webhook endpoint path (default: /webhook)
- `NODE_ENV`: Environment mode (default: development)

## Gmail API Setup

1. Create a project in the Google Cloud Console
2. Enable the Gmail API
3. Create credentials for your project
4. Set up a webhook endpoint in the Gmail API settings

## Usage

The server listens for POST requests at the specified webhook endpoint. It verifies the integrity of incoming requests using Google's JWT verification and processes the notification payload.

### Event Types

The server currently handles:
- `email-delivered`: Triggered when an email is delivered
- `email-read`: Triggered when an email is read
- `email-marked-as-spam`: Triggered when an email is marked as spam

### Logging

The server uses Winston for logging. In production, you should configure appropriate transports for your logging needs.

## Development

- Start the server in development mode:
  ```bash
  npm run dev
  ```
- Build the project:
  ```bash
  npm run build
  ```

## Production

- Start the server in production mode:
  ```bash
  npm start
  ```
- Use a process manager like PM2 for production deployments.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]
