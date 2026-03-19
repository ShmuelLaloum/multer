import axios from "axios";
import { IObject } from "../types";

const API_BASE = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
});

export const getAllObjects = async (): Promise<IObject[]> => {
  const { data } = await api.get("/objects");
  return data;
};

export const createObject = async (title: string): Promise<IObject> => {
  const { data } = await api.post("/objects", { title });
  return data;
};

export const getObjectById = async (objectId: string): Promise<IObject> => {
  const { data } = await api.get(`/objects/${objectId}`);
  return data;
};

export const uploadAttachments = async (objectId: string, files: File[]): Promise<IObject> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const { data } = await api.post(
    `/objects/${objectId}/attachments`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

export const deleteAttachment = async (objectId: string, fileName: string): Promise<IObject> => {
  const { data } = await api.delete(
    `/objects/${objectId}/attachments/${fileName}`
  );
  return data;
};

export const getFileUrl = (filePath: string): string => {
  return `${SERVER_URL}/${filePath}`;
};

export default api;
