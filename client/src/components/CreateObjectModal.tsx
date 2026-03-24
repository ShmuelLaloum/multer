import { useState } from "react";
import { Modal, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IObject } from "../types";
import styles from "../index.module.css";

interface CreateObjectModalProps {
  onSubmit: (title: string) => Promise<IObject | null>;
}

export default function CreateObjectModal({ onSubmit }: CreateObjectModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    const result = await onSubmit(title.trim());
    setLoading(false);
    if (result) {
      setTitle("");
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        size="large"
        className={styles["create-btn"]}
      >
        New Object
      </Button>

      <Modal
        title="Create New Object"
        open={open}
        onCancel={() => {
          setOpen(false);
          setTitle("");
        }}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText="Create"
        destroyOnClose
      >
        <Input
          placeholder="Enter object title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onPressEnter={handleSubmit}
          size="large"
          autoFocus
          style={{ marginTop: 16 }}
        />
      </Modal>
    </>
  );
}
