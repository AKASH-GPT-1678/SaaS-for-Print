import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { API_BASE_URL } from "@/lib/api";

let stompClient: Client | null = null;

export interface FileNotification {
  receiverId: string;
  fileName: string;
  fileUrl: string;
}

export const connectSocket = (
  userId: string,
  onMessage?: (data: FileNotification) => void
): void => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
    reconnectDelay: 5000,

    onConnect: () => {
      stompClient?.subscribe(
        `/topic/user/${userId}`,
        (message: IMessage) => {
          const data: FileNotification = JSON.parse(message.body);
          onMessage?.(data);
        }
      );
    },

    onStompError: (frame) => {
      console.error("Broker Error:", frame.headers["message"]);
    },
  });

  stompClient.activate();
};

export const getClient = (): Client | null => {
  return stompClient;
};

export const disconnectSocket = (): void => {
  if (stompClient?.active) {
    stompClient.deactivate();
  }
  stompClient = null;
};
