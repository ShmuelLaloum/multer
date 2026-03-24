import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import ObjectModel from "../models/Object.js";

export const getAllObjects = async (req: Request, res: Response) => {
  try {
    const objects = await ObjectModel.find().sort({ createdAt: -1 });
    res.json(objects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch objects" });
  }
};

export const createObject = async (req: Request, res: Response) => {
  try {
    let { title } = req.body;

    title = title?.trim();

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newObject = await ObjectModel.create({ title });
    res.status(201).json(newObject);
  } catch (error) {
    res.status(500).json({ message: "Failed to create object" });
  }
};

export const getObjectById = async (req: Request, res: Response) => {
  try {
    const obj = await ObjectModel.findById(req.params.objectId);
    if (!obj) {
      return res.status(404).json({ message: "Object not found" });
    }
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch object" });
  }
};

export const uploadAttachments = async (req: Request, res: Response) => {
  try {
    const obj = await ObjectModel.findById(req.params.objectId);
    if (!obj) {
      return res.status(404).json({ message: "Object not found" });
    }

    if (obj.attachments.length >= 5) {
      if (req.files) {
        (req.files as Express.Multer.File[]).forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      return res.status(400).json({ message: "Maximum 5 files allowed per object" });
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files as Express.Multer.File[];
    
    if (obj.attachments.length + files.length > 5) {
      files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({ message: `Cannot upload ${files.length} files. Limit is 5 total. Current: ${obj.attachments.length}` });
    }

    const newAttachments = files.map((file) => ({
      fileName: file.filename,
      originalName: file.originalname,
      path: file.path.replace(/\\/g, "/"),
      size: file.size,
      uploadedAt: new Date(),
    }));

    obj.attachments.push(...(newAttachments as any));
    await obj.save();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload attachments" });
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const { objectId, fileName } = req.params;
    const obj = await ObjectModel.findById(objectId);
    if (!obj) {
      return res.status(404).json({ message: "Object not found" });
    }
    const attachmentIndex = obj.attachments.findIndex((att) => att.fileName === fileName);
    if (attachmentIndex === -1) {
      return res.status(404).json({ message: "Attachment not found" });
    }
    const attachment = obj.attachments[attachmentIndex];
    const filePath = path.resolve(attachment.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    obj.attachments.splice(attachmentIndex, 1);
    await obj.save();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete attachment" });
  }
};
