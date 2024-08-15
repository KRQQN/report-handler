import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import ExifParser from 'exif-parser';
import Report from '../db/models/report.js';
import { Sequelize } from 'sequelize-typescript';

const reportRouter = express.Router();

const upload = multer({ dest: 'uploads/' });
//const buffer = Buffer.from([202,139,171,254,152,104,182,143,219,138,118,171,203,247,90,181,175,225,122,183]);

reportRouter.get( '/', async (req, res) => {
  const x = await Report.findAll()
  console.log(JSON.stringify(x))
  console.log()
  const buffer = Buffer.from(x[0].photo)
  console.log(buffer.toString('hex'))
  fs.writeFile('test-image.jpg', buffer)

  const r = Buffer.from(buffer.toString('hex'), 'hex')
  res.setHeader('Content-Type', 'image/jpeg'); // Set appropriate MIME type
  res.send(r);


  //res.send(JSON.stringify(x))
})

// POST endpoint to upload a photo and extract GPS data
reportRouter.post('/upload', upload.single('photo'), async (req, res) => {
  let filePath;
  try {
    // Check if the file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    filePath = req.file.path; // Save file path for cleanup

    // Read the uploaded file
    const fileBuffer = await fs.readFile(filePath);

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

    // Create a new report
    await Report.create({
      title: "Broken Streetlight",
      description: "The streetlight at the intersection is broken.",
      photo: fileBuffer, 
      coordinates: Sequelize.fn('ST_GeographyFromText', `SRID=4326;POINT(${gpsData?.latitude} ${gpsData?.longitude})`),
      reporter_email: "reporter@example.com"
    });

    // Return the extracted GPS data
    if (gpsData) {
      return res.json({ gpsData });
    } else {
      return res.status(404).json({ error: 'No GPS data found in the photo' });
    }
  } catch (error) {
    console.error('Error processing the photo:', error);
    return res.status(500).json({ error: 'Failed to process the photo' });
  } finally {
    // Delete the uploaded file after processing
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  }
});

export default reportRouter;
