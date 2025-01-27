
// TypeScript definitions for Gmail webhook events and payloads
export interface GmailEvent {
  type: string;
  apiVersion: string;
  requestId: string;
}

export interface GmailNotificationPayload {
  messageId: string;
  threadId: string;
  labelIds: string[];
  text: string;
  html: string;
  headers: {
    From: string;
    To: string;
    Subject: string;
    Date: string;
    'Message-ID': string;
  };
}

export interface GmailWebhookEvent {
  event: GmailEvent;
  payload: string; // Base64 encoded payload
  timestamp: string;
}

export type WebhookEventType = 'email-delivered' | 'email-read' | 'email-marked-as-spam';
