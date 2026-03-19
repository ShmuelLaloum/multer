export interface IAttachment {
  fileName: string;
  originalName: string;
  path: string;
  size: number;
  uploadedAt: string;
}

export interface IObject {
  _id: string;
  title: string;
  attachments: IAttachment[];
  createdAt: string;
  updatedAt: string;
}
