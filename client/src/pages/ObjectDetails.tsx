import { useEffect } from "react";
import {
  Card,
  Typography,
  Spin,
  Badge,
  Space,
  Empty,
  List,
} from "antd";
import {
  PaperClipOutlined,
  FolderOpenOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import useObjects from "../hooks/useObjects";
import AttachmentList from "../components/AttachmentList";
import UploadButton from "../components/UploadButton";
import CreateObjectModal from "../components/CreateObjectModal";
import { IObject } from "../types";

const { Title, Text } = Typography;

export default function ObjectDetails() {
  const {
    objects,
    currentObject,
    loading,
    uploading,
    fetchObjects,
    fetchObject,
    handleCreateObject,
    handleUpload,
    handleDeleteAttachment,
  } = useObjects();

  useEffect(() => {
    fetchObjects();
  }, [fetchObjects]);

  const handleSelectObject = (objectId: string) => {
    fetchObject(objectId);
  };

  const handleFilesSelected = async (files: File[]) => {
    if (!currentObject) return;
    await handleUpload(currentObject._id, files);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Space align="center">
            <AppstoreOutlined style={{ fontSize: 20 }} />
            <Title level={4} style={{ margin: 0, color: "#fff" }}>
              Objects
            </Title>
          </Space>
          <CreateObjectModal onSubmit={handleCreateObject} />
        </div>

        <div className="sidebar-list">
          {loading && objects.length === 0 ? (
            <div className="center-spin">
              <Spin />
            </div>
          ) : objects.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text style={{ color: "rgba(255,255,255,0.5)" }}>
                  No objects yet
                </Text>
              }
            />
          ) : (
            <List
              dataSource={objects}
              renderItem={(obj: IObject) => (
                <div
                  key={obj._id}
                  className={`sidebar-item ${
                    currentObject?._id === obj._id ? "active" : ""
                  }`}
                  onClick={() => handleSelectObject(obj._id)}
                >
                  <FolderOpenOutlined className="sidebar-item-icon" />
                  <div className="sidebar-item-content">
                    <Text
                      ellipsis
                      className="sidebar-item-title"
                    >
                      {obj.title}
                    </Text>
                    <Badge
                      count={obj.attachments?.length || 0}
                      showZero
                      color="#6c5ce7"
                      style={{ fontSize: 10 }}
                    />
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </aside>

      <main className="main-content">
        {!currentObject ? (
          <div className="empty-state">
            <FolderOpenOutlined style={{ fontSize: 64, color: "#6c5ce7" }} />
            <Title level={3} style={{ color: "#a0a0b0", marginTop: 16 }}>
              Select an object to view details
            </Title>
            <Text type="secondary">
              Choose from the sidebar or create a new object
            </Text>
          </div>
        ) : (
          <div className="details-container">
            <div className="details-header">
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {currentObject.title}
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  ID: {currentObject._id}
                </Text>
              </div>
            </div>

            <Card
              className="attachments-card"
              title={
                <Space>
                  <PaperClipOutlined />
                  <span>Attachments</span>
                  <Badge
                    count={currentObject.attachments?.length || 0}
                    showZero
                    style={{ backgroundColor: "#6c5ce7" }}
                  />
                </Space>
              }
              extra={
                <UploadButton
                  onFilesSelected={handleFilesSelected}
                  uploading={uploading}
                />
              }
            >
              {loading ? (
                <div className="center-spin">
                  <Spin size="large" />
                </div>
              ) : (
                <AttachmentList
                  attachments={currentObject.attachments}
                  objectId={currentObject._id}
                  onDelete={handleDeleteAttachment}
                />
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
