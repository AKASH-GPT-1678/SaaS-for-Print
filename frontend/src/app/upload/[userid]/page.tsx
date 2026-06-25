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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upload Room</h1>

      <p style={styles.subtitle}>
        User ID: <b>{}</b>
      </p>

      {/* File Input */}
      <div style={styles.box}>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      {/* File Preview */}
      <div style={styles.list}>
        {files.length === 0 ? (
          <p style={{ color: "#888" }}>No files selected</p>
        ) : (
          files.map((file, index) => (
            <div key={index} style={styles.fileItem}>
              <div>
                📄 {file.name}
                <br />
                <small>{(file.size / 1024).toFixed(2)} KB</small>
              </div>

              <button
                onClick={() => removeFile(index)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <button
  onClick={sendFiles}
>
  Send Files
</button>
    </div>
  );
};

export default Page;

// simple inline styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 20,
    maxWidth: 600,
    margin: "0 auto",
    fontFamily: "Arial",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
  },
  subtitle: {
    marginBottom: 20,
    color: "#555",
  },
  box: {
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 10,
    marginBottom: 20,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  fileItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    border: "1px solid #eee",
    borderRadius: 8,
    alignItems: "center",
  },
  removeBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: 5,
  },
};
