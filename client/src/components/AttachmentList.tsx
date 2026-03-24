import { List, Button, Typography, Empty, Tooltip, Popconfirm, Tag } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getFileIcon, formatFileSize } from "../utils/fileHelpers";
import { getFileUrl } from "../api/objectsApi";
import { IAttachment } from "../types";
import styles from "../index.module.css";

const { Text } = Typography;

interface AttachmentListProps {
  attachments: IAttachment[];
  objectId: string;
  onDelete: (objectId: string, fileName: string) => void;
}

export default function AttachmentList({ attachments, objectId, onDelete }: AttachmentListProps) {
  if (!attachments || attachments.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No attachments yet"
        style={{ padding: "32px 0" }}
      />
    );
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={attachments}
      renderItem={(file: IAttachment) => {
        const fileUrl = getFileUrl(file.path);
        const uploadDate = new Date(file.uploadedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <List.Item
            className={styles["attachment-item"]}
            actions={[
              <Tooltip title="View file" key="view">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  href={fileUrl}
                  target="_blank"
                  className={`${styles["action-btn"]} ${styles["view-btn"]}`}
                />
              </Tooltip>,
              <Tooltip title="Download" key="download">
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  href={fileUrl}
                  download={file.originalName}
                  target="_blank"
                  className={`${styles["action-btn"]} ${styles["download-btn"]}`}
                />
              </Tooltip>,
              <Popconfirm
                key="delete"
                title="Delete this file?"
                description="This action cannot be undone."
                onConfirm={() => onDelete(objectId, file.fileName)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Delete">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    className={`${styles["action-btn"]} ${styles["delete-btn"]}`}
                  />
                </Tooltip>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={getFileIcon(file.originalName)}
              title={
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles["file-link"]}
                >
                  {file.originalName}
                </a>
              }
              description={
                <div className={styles["file-meta"]}>
                  <Tag color="blue">{formatFileSize(file.size)}</Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {uploadDate}
                  </Text>
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
}
