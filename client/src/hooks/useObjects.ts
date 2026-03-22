import { useState, useCallback } from "react";
import { message } from "antd";
import { IObject } from "../types";
import {
  getAllObjects,
  createObject,
  getObjectById,
  uploadAttachments,
  deleteAttachment,
} from "../api/objectsApi";

export default function useObjects() {
  const [objects, setObjects] = useState<IObject[]>([]);
  const [currentObject, setCurrentObject] = useState<IObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchObjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllObjects();
      setObjects(data);
    } catch (err) {
      message.error("Failed to fetch objects");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateObject = useCallback(async (title: string) => {
    try {
      const data = await createObject(title);
      setObjects((prev) => [data, ...prev]);
      setCurrentObject(data);
      message.success("Object created successfully");
      return data;
    } catch (err) {
      message.error("Failed to create object");
      return null;
    }
  }, []);

  const fetchObject = useCallback(async (objectId: string) => {
    setLoading(true);
    try {
      const data = await getObjectById(objectId);
      setCurrentObject(data);
      return data;
    } catch (err) {
      message.error("Failed to fetch object");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpload = useCallback(async (objectId: string, files: File[]) => {
    setUploading(true);
    try {
      const data = await uploadAttachments(objectId, files);
      setCurrentObject(data);
      setObjects((prev) =>
        prev.map((obj) => (obj._id === data._id ? data : obj))
      );
      message.success(
        `${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully`
      );
      return data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to upload files";
      message.error(errMsg);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDeleteAttachment = useCallback(async (objectId: string, fileName: string) => {
    try {
      const data = await deleteAttachment(objectId, fileName);
      setCurrentObject(data);
      setObjects((prev) =>
        prev.map((obj) => (obj._id === data._id ? data : obj))
      );
      message.success("File deleted successfully");
      return data;
    } catch (err) {
      message.error("Failed to delete file");
      return null;
    }
  }, []);

  return {
    objects,
    currentObject,
    loading,
    uploading,
    fetchObjects,
    fetchObject,
    handleCreateObject,
    handleUpload,
    handleDeleteAttachment,
  };
}
