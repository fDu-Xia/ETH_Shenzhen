# IPFS File Upload Demo Setup Guide

This demo allows users to upload files to IPFS using the Filebase SDK. Follow these steps to set it up:

## 1. Filebase Account Setup

1. Go to [Filebase](https://filebase.com/) and create an account
2. Create a new bucket for your uploads
3. Get your S3-compatible API credentials from the dashboard

## 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Filebase Configuration
FILEBASE_S3_KEY=your_filebase_s3_access_key_here
FILEBASE_S3_SECRET=your_filebase_s3_secret_key_here
FILEBASE_BUCKET_NAME=your_bucket_name_here

# Optional: Custom IPFS Gateway (defaults to ipfs.io)
# IPFS_GATEWAY=https://ipfs.io
```

## 3. How It Works

The demo consists of:

- **Frontend**: `app/demo/page.tsx` - Beautiful UI with drag & drop file upload
- **API**: `app/api/upload/route.ts` - Handles file uploads using Filebase SDK
- **Features**:
  - Drag & drop file selection
  - File size validation (100MB limit)
  - Progress indicators
  - IPFS hash display
  - Direct file access URLs

## 4. Filebase SDK Usage

The API route uses the Filebase SDK as documented at [https://filebase.github.io/filebase-sdk/tutorial-quickstart-object.html](https://filebase.github.io/filebase-sdk/tutorial-quickstart-object.html):

```typescript
import { ObjectManager } from '@filebase/sdk';

const objectManager = new ObjectManager(S3_KEY, S3_SECRET, {
  bucket: BUCKET_NAME
});

const uploadedObject = await objectManager.upload(objectName, buffer);
```

## 5. Testing the Demo

1. Start your development server: `pnpm run dev`
2. Navigate to `/demo` in your browser
3. Upload a file and see it stored on IPFS!

## 6. Security Notes

- File size is limited to 100MB
- Files are stored with unique names to prevent conflicts
- CORS is configured for cross-origin requests
- Error handling includes detailed logging

## 7. Customization

You can customize:
- File size limits in the API route
- IPFS gateway URLs
- Bucket naming conventions
- UI styling and animations
