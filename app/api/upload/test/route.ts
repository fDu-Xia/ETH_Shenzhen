import { NextResponse } from 'next/server';
import { ObjectManager } from '@filebase/sdk';

export async function GET() {
  try {
    // Check environment variables
    const S3_KEY = process.env.FILEBASE_S3_KEY || '';
    const S3_SECRET = process.env.FILEBASE_S3_SECRET || '';
    const BUCKET_NAME = process.env.FILEBASE_BUCKET_NAME || 'demo-uploads';

    const envStatus = {
      S3_KEY: S3_KEY ? 'Set' : 'Missing',
      S3_SECRET: S3_SECRET ? 'Set' : 'Missing',
      BUCKET_NAME: BUCKET_NAME
    };

    if (!S3_KEY || !S3_SECRET) {
      return NextResponse.json({
        error: 'Missing Filebase credentials',
        envStatus,
        message: 'Please check your .env.local file'
      });
    }

    // Test ObjectManager initialization
    const objectManager = new ObjectManager(S3_KEY, S3_SECRET, {
      bucket: BUCKET_NAME
    });

    // Test basic methods
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(objectManager));
    
    return NextResponse.json({
      success: true,
      message: 'Filebase SDK test successful',
      envStatus,
      bucket: BUCKET_NAME,
      availableMethods: methods,
      sdkVersion: '1.0.6'
    });

  } catch (error) {
    console.error('Test error:', error);
    
    return NextResponse.json({
      error: 'Filebase SDK test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
