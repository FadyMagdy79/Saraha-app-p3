import multer, { diskStorage } from "multer";
import crypto from 'node:crypto';
import { AppError } from "../../lib/error/error.js";
import { allowedFields } from "../../lib/media/file.validation.js";
function multerUPload(allowedTypes = allowedFields.images) {

return multer({
    fileFilter: function (req, file, cb) {
        if (!allowedTypes.includes(file.mimetype)) {
          return  cb(new AppError("invalid file format", 400), false);
        } 
            cb(null, true);
        
    },
    storage: diskStorage({
        destination: "uploads",
        filename: function (req, file, cb) {
            
            cb(null, `${crypto.randomUUID()}-${file.originalname}`);
        }
    })
});
}

 export function UploadSingleFile(fileName , allowedTypes = allowedFields.images ) {
    return multerUPload(allowedTypes).single(fileName);
}
export function UploadFilesArray(fieldName,maxCount) {
    return multerUPload().array(fieldName,maxCount);
}
export function UploadFields(fields) {
    return multerUPload().fields(fields);
}


