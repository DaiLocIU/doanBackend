import path from 'path';
import multer from 'multer';

export function parseFullName(fullName: string): [string, string] {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return [fullName, ''];
  }

  const lastName = parts.pop();
  return [parts.join(' '), lastName];
}

export const primaryStoreMulterOption = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const filename = path.parse(file.originalname).name.replace(/\s/g, '');
    const extension = path.parse(file.originalname).ext;

    cb(null, `${filename}${extension}`);
  },
});
