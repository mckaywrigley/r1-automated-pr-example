
        // TypeScript definitions for Gmail API webhook notifications
        interface BaseNotification {
          message_id: string;
          event_type: string;
          timestamp: number;
          metadata: {
            [key: string]: string;
          };
        }

        interface MessageDelivered extends BaseNotification {
          event_type: "message_delivered";
          payload: {
            message: {
              id: string;
              thread_id: string;
              label_ids: string[];
              from: string;
              to: string;
              subject: string;
              text: string;
              html: string;
              received_at: number;
            };
          };
        }

        interface MessageRead extends BaseNotification {
          event_type: "message_read";
          payload: {
            message: {
              id: string;
              thread_id: string;
              read_at: number;
            };
          };
        }

        interface MessageMoved extends BaseNotification {
          event_type: "message_moved";
          payload: {
            message: {
              id: string;
              old_label_ids: string[];
              new_label_ids: string[];
            };
          };
        }

        type Notification = MessageDelivered | MessageRead | MessageMoved;
      