
        # Gmail Webhook Server

        A production-ready Express server for handling Gmail API push notifications.

        ## Setup

        1. Clone the repository
        2. Install dependencies:
           ```bash
           npm install
           ```
        3. Create a .env file using the example provided:
           ```bash
           cp .env.example .env
           ```
        4. Update the environment variables in .env with your actual values

        ## Configuration

        The server uses the following environment variables:

        - `PORT`: The port to listen on (default: 3000)
        - `WEBHOOK_SECRET`: Your Gmail API webhook secret
        - `JWT_KEY`: Your JWT signing key

        ## Running the Server

        ```bash
        npm start
        ```

        ## Testing

        To test the webhook endpoint, you can use tools like curl or Postman:

        ```bash
        curl -X POST http://localhost:3000/webhook \
          -H "Content-Type: application/json" \
          -d '{"message_id":"123","event_type":"message_delivered","timestamp":1623456789,"metadata":{}}'
        ```

        ## Deployment

        1. Use a process manager like PM2:
           ```bash
           pm2 start server.ts
           ```
        2. Use a reverse proxy like NGINX to expose the server to the internet
        3. Make sure your server is accessible via HTTPS

        ## Security Considerations

        - Always validate the Google-Signature header
        - Use proper error handling and logging
        - Keep your environment variables secure
        - Regularly update dependencies
      