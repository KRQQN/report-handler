import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import ExifParser from 'exif-parser';
import { supabase } from '../db/supabase/supabase.js';

const upload = multer({ dest: 'uploads/' });

const reportRouter = Router();

reportRouter.post(
  '/upload',
  upload.single('photo'),
  async (req: Request, res: Response) => {
    let filePath;
    try {

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      filePath = req.file.path;
      console.log('Uploaded file:', filePath);
      const fileBuffer = await fs.readFile(filePath);

      const parser = ExifParser.create(fileBuffer);
      const result = parser.parse();

      const gpsData =
        result.tags?.GPSLatitude && result.tags?.GPSLongitude
          ? {
              latitude: result.tags.GPSLatitude,
              longitude: result.tags.GPSLongitude,
              altitude: result.tags.GPSAltitude || 'N/A',
            }
          : null;

      const { data: storageData, error: storageError } = await supabase.storage
        .from('photos')
        .upload(`${req.file.filename}`, fileBuffer, {
          contentType: req.file.mimetype,
        });

      if (storageError) throw storageError;

      const { data, error } = await supabase.from('reports').insert({
        title: 'Broken Streetlight',
        description: 'The streetlight at the intersection is broken.',
        photo_url: storageData?.path,
        coordinates: gpsData
          ? `SRID=4326;POINT(${gpsData.latitude} ${gpsData.longitude})`
          : null,
        reporter_email: 'reporter@example.com',
      });

      if (error) throw error;

      
      if (gpsData) {
        return res.json({ gpsData });
      } else {
        return res.status(404).json({ error: 'No GPS data found in the photo' });
      }
    } catch (error) {
      console.error('Error processing the photo:', error);
      return res.status(500).json({ error: 'Failed to process the photo' });
    } finally {
      
      if (filePath) {
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }
    }
  },
);
reportRouter.get('/test', async (req: Request, res: Response) => {
  const { data, error } = await supabase.rpc('nearby_reports', {
    lat: -4.606190,
    long: 36.575917,
  })
  
  return res.json({ ...data[0], coordinates: `${data[0].long},${data[0].lat}` });
})

const supernearby = {
  lat: -4.606190,
  long: 36.575917,
}

reportRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const photoUrl = data.photo_url;
    console.log('Photo URL:', photoUrl);
    console.log(supabase.storage.from('photos').getPublicUrl(photoUrl).data.publicUrl);
    return res.status(200).send(supabase.storage.from('photos').getPublicUrl(photoUrl));
    /* res.json({
      id: data.id,
      title: data.title,
      description: data.description,
      photo_url: photoUrl,
      coordinates: data.coordinates,
      reporter_email: data.reporter_email,
    }); */
  } catch (error) {
    console.error('Error retrieving the report:', error);
    return res.status(500).json({ error: 'Failed to retrieve the report' });
  }
});


export default reportRouter;
