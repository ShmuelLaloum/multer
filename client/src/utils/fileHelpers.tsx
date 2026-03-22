import React, { ReactNode } from "react";
import {
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileOutlined,
} from "@ant-design/icons";

export const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  const iconMap: Record<string, ReactNode> = {
    pdf: <FilePdfOutlined style={{ fontSize: 20, color: "#e74c3c" }} />,
    jpg: <FileImageOutlined style={{ fontSize: 20, color: "#3498db" }} />,
    jpeg: <FileImageOutlined style={{ fontSize: 20, color: "#3498db" }} />,
    png: <FileImageOutlined style={{ fontSize: 20, color: "#27ae60" }} />,
    docx: <FileWordOutlined style={{ fontSize: 20, color: "#2980b9" }} />,
  };

  return iconMap[ext] || <FileOutlined style={{ fontSize: 20, color: "#95a5a6" }} />;
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};
