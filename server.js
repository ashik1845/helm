const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique file names
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Handle document uploads
app.post('/upload', upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'rc', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'id-proof', maxCount: 1 }
]), (req, res) => {
    // If all files are uploaded, send success response
    if (req.files) {
        console.log(req.files);
        res.json({ success: true, message: 'Files uploaded successfully!' });
    } else {
        res.status(400).json({ success: false, message: 'Failed to upload files.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
