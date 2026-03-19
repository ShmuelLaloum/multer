import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  getAllObjects,
  createObject,
  getObjectById,
  uploadAttachments,
  deleteAttachment,
} from "../controllers/objectController.js";

const router = express.Router();

router.get("/", getAllObjects);
router.post("/", createObject);
router.get("/:objectId", getObjectById);

router.post("/:objectId/attachments", upload.array("files", 5), uploadAttachments);
router.delete("/:objectId/attachments/:fileName", deleteAttachment);

export default router;
