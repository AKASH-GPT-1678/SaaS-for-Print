import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "@/lib/api";

let stompClient: Client | null = null;

export interface FileNotification {
	documentId: string;
	receiverId: string;
	fileName: string;
	contentType: string;
	fileSize: number;
	fileData: string;
	note?: string | null;
}

export const connectSocket = (
	userId: string,
	token: string,
	onMessage?: (data: FileNotification) => void,
	onConnectionChange?: (connected: boolean) => void,
): void => {
	const client = new Client({
		webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
		connectHeaders: { Authorization: `Bearer ${token}` },
		reconnectDelay: 5000,

		onConnect: () => {
			onConnectionChange?.(true);
			client.subscribe(`/topic/user/${userId}`, (message: IMessage) => {
				const data: FileNotification = JSON.parse(message.body);
				onMessage?.(data);
			});
		},

		onStompError: (frame) => {
			onConnectionChange?.(false);
			console.error("Broker Error:", frame.headers.message);
		},
		onWebSocketClose: () => onConnectionChange?.(false),
		onWebSocketError: () => onConnectionChange?.(false),
	});

	stompClient = client;
	client.activate();
};

export const getClient = (): Client | null => {
	return stompClient;
};

export const disconnectSocket = (): void => {
	void stompClient?.deactivate();
	stompClient = null;
};
