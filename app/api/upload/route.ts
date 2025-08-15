import { NextRequest, NextResponse } from 'next/server';
import { ObjectManager } from '@filebase/sdk';

// Filebase configuration
const S3_KEY = process.env.FILEBASE_S3_KEY || '';
const S3_SECRET = process.env.FILEBASE_S3_SECRET || '';
const BUCKET_NAME = process.env.FILEBASE_BUCKET_NAME || 'demo-uploads';

export async function POST(request: NextRequest) {
  try {
    // Check if Filebase credentials are configured
    if (!S3_KEY || !S3_SECRET) {
      return NextResponse.json(
        { error: 'Filebase credentials not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (limit to 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 100MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || '';
    const objectName = `upload-${timestamp}-${randomString}.${fileExtension}`;

    console.log('Uploading file:', {
      fileName: file.name,
      fileSize: file.size,
      objectName: objectName,
      bucket: BUCKET_NAME
    });

    // Initialize ObjectManager with Filebase SDK
    const objectManager = new ObjectManager(S3_KEY, S3_SECRET, {
      bucket: BUCKET_NAME
    });

    // Upload file to IPFS via Filebase using the correct method
    console.log('Starting upload...');
    const uploadedObject = await objectManager.upload(objectName, buffer);
    console.log('Upload result:', uploadedObject);

    // Get the IPFS hash from the upload result
    // The response structure might be different, let's handle both cases
    let ipfsHash = '';
    if (typeof uploadedObject === 'string') {
      ipfsHash = uploadedObject;
    } else if (uploadedObject && typeof uploadedObject === 'object') {
      ipfsHash = uploadedObject.Hash || uploadedObject.Key || uploadedObject.hash || objectName;
    } else {
      ipfsHash = objectName;
    }
    
    // Construct the IPFS gateway URL
    const fileUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    console.log('Upload successful:', {
      ipfsHash: ipfsHash,
      fileUrl: fileUrl
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully to IPFS',
      ipfsHash: ipfsHash,
      fileUrl: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      objectName: objectName
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // More detailed error information
    let errorMessage = 'Failed to upload file to IPFS';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
