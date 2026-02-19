# Image Upload System - Testing Guide

## What Was Implemented

### Backend Changes:
1. **Multer Configuration** (`backend/src/config/multer.js`)
   - Handles file uploads to **Cloudinary**
   - Storage: `multer-storage-cloudinary`
   - Accepts: jpeg, jpg, png, gif, webp
   - Max file size: 5MB per image
   - Folder: `garment-products`

2. **Upload Route** (`backend/src/routes/uploadRoutes.js`)
   - Endpoint: `POST /api/v1/upload/products`
   - Returns Cloudinary secure URLs

3. **Cloudinary Configuration** (`backend/.env`)
   - Needs `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Frontend Changes:
1. **Next.js Config** (`frontend/next.config.ts`)
   - Added localhost to allowed image domains
   - Allows loading images from backend server

2. **Admin Dashboard** (`admin-dashboard/src/app/products-manage/page.tsx`)
   - Replaced URL input with file upload
   - Added image preview functionality
   - Shows upload progress
   - Handles multiple images (up to 5)

## How to Test

### Step 1: Verify Backend is Running
- Backend should be running on `http://localhost:5000`
- Check terminal for: "Server running in development mode on port 5000"

### Step 2: Login to Admin Dashboard
1. Go to admin dashboard (usually `http://localhost:3001`)
2. Login with vendor credentials

### Step 3: Upload a Product with Images
1. Click "Add New Product" button
2. Fill in product details:
   - Product Name
   - Description
   - Price
   - Stock Level
   - Category
3. Click "Choose Files" under "Product Images"
4. Select 1-5 images (jpg, png, gif, or webp)
5. Preview should appear below the file input
6. Click "Upload Product"
7. Wait for "Uploading..." to complete

### Step 4: Verify Upload
1. Check if product appears in the product list
2. Product should show the uploaded image thumbnail
3. Go to frontend (`http://localhost:3000`)
4. Product should display with uploaded images

### Step 5: Check Backend Storage
- Navigate to: `backend/uploads/products/`
- Uploaded images should be stored there with unique filenames
- Format: `[timestamp]-[random]-[original-extension]`

## Troubleshooting

### Images Not Displaying
- Check Next.js config has localhost in remotePatterns
- Verify backend is serving static files from /uploads
- Check browser console for CORS errors

### Upload Fails
- Verify file size is under 5MB
- Check file type is supported (jpg, png, gif, webp)
- Ensure you're logged in as vendor/admin
- Check backend terminal for errors

### Backend Not Restarting
- Nodemon should auto-restart when files change
- If not, manually restart: `npm run dev` in backend folder

## API Endpoints

### Upload Images
```
POST /api/v1/upload/products
Headers: Authorization: Bearer [token]
Body: FormData with 'images' field (multiple files)
Response: { success: true, count: 2, data: ["url1", "url2"] }
```

### Create Product
```
POST /api/v1/products
Headers: Authorization: Bearer [token]
Body: {
  name: string,
  description: string,
  price: number,
  stock: number,
  category: string,
  images: string[] // URLs from upload endpoint
}
```

## File Structure
```
backend/
├── src/
│   ├── config/
│   │   └── multer.js          # Upload configuration
│   ├── routes/
│   │   └── uploadRoutes.js    # Upload endpoint
│   └── app.js                 # Added static file serving
└── uploads/
    └── products/              # Uploaded images stored here
        ├── .gitignore
        └── .gitkeep

admin-dashboard/
└── src/
    └── app/
        └── products-manage/
            └── page.tsx       # File upload UI

frontend/
└── next.config.ts            # Added localhost to allowed domains
```

## Security Notes
- Only authenticated vendors/admins can upload
- File type validation prevents non-image uploads
- File size limited to 5MB
- Uploaded files stored outside public git repository
