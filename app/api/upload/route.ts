import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

// Filebase configuration (S3-compatible)
const S3_KEY = process.env.FILEBASE_S3_KEY || '';
const S3_SECRET = process.env.FILEBASE_S3_SECRET || '';
const BUCKET_NAME = process.env.FILEBASE_BUCKET_NAME || 'demo-uploads';
const ENDPOINT = 'https://s3.filebase.com'; // Filebase S3 endpoint

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

    // Create S3 client for Filebase
    const s3Client = new S3Client({
      region: 'us-east-1', // Filebase uses us-east-1
      endpoint: ENDPOINT,
      credentials: {
        accessKeyId: S3_KEY,
        secretAccessKey: S3_SECRET,
      },
      forcePathStyle: true, // Required for Filebase
    });

    console.log('Starting upload...');
    
    // Upload file using S3 PutObject command
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectName,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
      Metadata: {
        filename: file.name,
        size: file.size.toString(),
        uploaded: new Date().toISOString()
      }
    });

    const uploadResult = await s3Client.send(uploadCommand);
    console.log('Upload result:', uploadResult);

    // Get the IPFS hash by checking the object metadata
    const headCommand = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectName,
    });

    const headResult = await s3Client.send(headCommand);
    console.log('Head result:', headResult);

    // Extract IPFS hash from metadata
    const ipfsHash = headResult.Metadata?.cid || objectName;
    
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
