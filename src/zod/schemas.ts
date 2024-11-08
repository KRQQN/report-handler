import { z } from 'zod';

export const ReportSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string(),
  photo: z.instanceof(Buffer),
  reporter_email: z.string().email(),
  status: z.enum(['unhandled', 'planning', 'ready']),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export type ReportType = z.infer<typeof ReportSchema>;
