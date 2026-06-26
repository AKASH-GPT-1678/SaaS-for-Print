"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Inbox } from "lucide-react";

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
      setFiles((prev) => [notification, ...prev]);
    });

    return () => {
      disconnectSocket();
    };
  }, [userId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            File Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Receive and manage files in real-time through Socket.IO
          </p>
        </div>

        {/* User Card */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Connected User</p>

          <p className="mt-2 font-mono text-lg text-blue-600">
            {userId || "Not Connected"}
          </p>
        </div>

        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Received Files
            </h2>

            <p className="text-sm text-slate-500">
              Files received in real time
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            {files.length} Files
          </div>
        </div>

        {/* Empty State */}
        {files.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Inbox className="h-10 w-10 text-slate-400" />
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              No Files Received Yet
            </h3>

            <p className="mt-2 max-w-md text-center text-slate-500">
              Waiting for incoming files. New files will automatically appear
              here when received.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="
              group
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
              >
                {/* File Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  <FileText className="h-7 w-7 text-blue-600" />
                </div>

                {/* File Name */}
                <h3 className="truncate text-lg font-semibold text-slate-900">
                  {file.fileName}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Received successfully via Socket.IO
                </p>

                {/* Divider */}
                <div className="my-5 h-px bg-slate-100" />

                {/* Download Button */}
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                py-3
                font-medium
                text-white
                transition-all
                hover:bg-blue-700
              "
                >
                  <Download size={18} />
                  Download File
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ChatPage;
