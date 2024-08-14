import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import ExifParser from 'exif-parser';

const reportRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

// POST endpoint to upload a photo and extract GPS data
reportRouter.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    // Check if the file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded file
    const fileBuffer = await fs.readFile(req.file.path);

    // Parse the EXIF data
    const parser = ExifParser.create(fileBuffer);
    const result = parser.parse();

    // Extract GPS data
    const gpsData =
      result.tags?.GPSLatitude && result.tags?.GPSLongitude
        ? {
            latitude: result.tags.GPSLatitude,
            longitude: result.tags.GPSLongitude,
            altitude: result.tags.GPSAltitude || 'N/A',
          }
        : null;

    // Delete the uploaded file after processing
    await fs.unlink(req.file.path);

    // Return the extracted GPS data
    if (gpsData) {
      return res.json({ gpsData });
    } else {
      return res.status(404).json({ error: 'No GPS data found in the photo' });
    }
  } catch (error) {
    console.error('Error processing the photo:', error);
    return res.status(500).json({ error: 'Failed to process the photo' });
  }
});

export default reportRouter;
