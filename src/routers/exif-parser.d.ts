declare module 'exif-parser' {
    interface Tags {
      GPSLatitude?: number;
      GPSLongitude?: number;
      GPSAltitude?: number;
      [key: string]: any;
    }
  
    interface ParseResult {
      tags: Tags;
      [key: string]: any;
    }
  
    export interface ExifParser {
      parse: () => ParseResult;
    }
  
    export function create(buffer: Buffer): ExifParser;
  }