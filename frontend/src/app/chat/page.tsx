"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import {
  connectSocket,
  disconnectSocket,
  FileNotification,
} from "@/lib/socket";

const ChatPage = () => {
  const userId = useAppSelector((state) => state.data.userId);

  const [files, setFiles] = useState<FileNotification[]>([]);

  useEffect(() => {
    if (!userId) return;

    connectSocket(userId, (notification: FileNotification) => {
      console.log("Incoming File:", notification);

      setFiles((prev) => [notification, ...prev]);
    });

    return () => {
      disconnectSocket();
    };
  }, [userId]);

  return (
    <div>
      <p>User ID: {userId}</p>

      <h2>Received Files</h2>

      {files.map((file, index) => (
        <div
          key={index}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>File: {file.fileName}</p>

          <a href={file.fileUrl} target="_blank">
            Download
          </a>
        </div>
      ))}
    </div>
  );
};

export default ChatPage;
