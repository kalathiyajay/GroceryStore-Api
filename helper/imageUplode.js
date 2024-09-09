const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = file.fieldname;
        const uploadPath = path.join('public', folderName);

        fs.mkdir(uploadPath, { recursive: true }, function (err) {
            if (err) {
                return cb(err);
            }
            cb(null, uploadPath);
        });
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replaceAll(' ', '')}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;