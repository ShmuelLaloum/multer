import { useRef } from "react";
import { Button } from "antd";
import { PaperClipOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "../index.module.css";

interface UploadButtonProps {
  onFilesSelected: (files: File[]) => void;
  uploading: boolean;
}

export default function UploadButton({ onFilesSelected, uploading }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!uploading) {
      inputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.docx"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <Button
        type="primary"
        icon={
          uploading ? (
            <LoadingOutlined />
          ) : (
            <PaperClipOutlined />
          )
        }
        onClick={handleClick}
        disabled={uploading}
        size="large"
        className={styles["upload-btn"]}
      >
        {uploading ? "Uploading..." : "Attach Files"}
      </Button>
    </>
  );
}
