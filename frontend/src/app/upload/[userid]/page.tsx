"use client";

import React, { useState } from "react";
import { use } from "react";

const Page = ({ params }: { params: Promise<{ userid: string }> }) => {
  const { userid } = use(params);

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (!selectedFiles) return;

    // convert FileList → array and store
    setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const sendFiles = async () => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file);
      });

      formData.append("receiverId", userid);

      const response = await fetch("http://localhost:8080/docs/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload");
      }

      const result = await response.json();

      console.log("Upload Success", result);

      setFiles([]);
    } catch (error) {
      console.error(error);
    }
  };
    const inputRef = React.useRef<HTMLInputElement>(null);
  

  return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl items-center">
        <div className="w-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
              Upload Room
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              User ID: <span className="font-semibold text-slate-900">{userid}</span>
            </p>
          </div>

          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center sm:p-8">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
              <span className="text-xl" aria-hidden="true">
                +
              </span>
            </div>

            <p className="text-base font-medium text-slate-900">
              Upload your documents
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Select PDFs, Word files, spreadsheets, slides, text files, or CSVs.
            </p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 sm:w-auto"
            >
              Choose Documents
            </button>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Selected Files
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {files.length} {files.length === 1 ? "file" : "files"}
              </span>
            </div>

            {files.length === 0 ? (
              <div className="rounded-lg border border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                No files selected
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="inline-flex w-full items-center justify-center rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={sendFiles}
            disabled={files.length === 0}
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Send Files
          </button>
        </div>
      </section>
    </main>

  );
};

export default Page;

// simple inline styles

