# ShotUpload SDK

A JavaScript library with embeddable image and file upload components that work with both React and jQuery applications.

## Installation

```bash
npm install shotupload
```

## React Components

### ImageUploader Component

```jsx
import React from 'react';
import { ImageUploader } from 'shotupload-sdk/react';

function App() {
  return (
    <div>
      <h1>Upload Your Images</h1>
      <ImageUploader 
        uploadUrl="/api/upload"
        onSuccess={(response, file) => {
          console.log('Upload successful:', response);
        }}
        onError={(error, file) => {
          console.error('Upload failed:', error);
        }}
      />
    </div>
  );
}
```

### FileUploader Component

```jsx
import React from 'react';
import { FileUploader } from 'shotupload-sdk/react';

function App() {
  return (
    <div>
      <h1>Upload Your Files</h1>
      <FileUploader 
        uploadUrl="/api/upload"
        multiple={true}
        allowedTypes={['application/pdf', 'text/plain']}
        onSuccess={(response, file) => {
          console.log('Upload successful:', response);
        }}
      />
    </div>
  );
}
```

### Custom Upload Handler Example

You can provide your own upload implementation by using the `handleUpload` prop:

```jsx
import React, { useState } from 'react';
import { ImageUploader, FileUploader } from 'shotupload-sdk/react';

function App() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Custom upload handler for images
  const handleImageUpload = async (file, onProgress) => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', 'user-123');
      
      // Custom headers or authentication
      const headers = {
        'Authorization': `Bearer ${yourAuthToken}`
      };
      
      // Use XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        };
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            setUploadedImageUrl(response.imageUrl);
            resolve(response);
          } else {
            reject(new Error('Upload failed'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error'));
        
        xhr.open('POST', 'https://your-api.com/upload', true);
        
        // Set custom headers
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });
        
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Custom upload handler for files with AWS S3
  const handleFileUpload = async (file, onProgress) => {
    try {
      // Step 1: Get pre-signed URL from your backend
      const { uploadUrl, fileKey } = await getPresignedUrl(file.name, file.type);
      
      // Step 2: Upload directly to S3 with progress
      await uploadToS3(file, uploadUrl, onProgress);
      
      // Step 3: Update your backend with the successful upload
      const fileData = await notifyBackendOfUpload(fileKey, file.name);
      
      setUploadedFiles(prev => [...prev, fileData]);
      return fileData;
    } catch (error) {
      console.error('S3 upload failed:', error);
      throw error;
    }
  };
  
  return (
    <div>
      <h2>Custom Image Upload</h2>
      <ImageUploader 
        handleUpload={handleImageUpload}
        onSuccess={(response) => console.log('Custom upload succeeded:', response)}
        onError={(error) => console.error('Custom upload failed:', error)}
      />
      
      <h2>Custom File Upload to S3</h2>
      <FileUploader 
        handleUpload={handleFileUpload}
        multiple={true}
        allowedTypes={['application/pdf', 'text/plain']}
        value={uploadedFiles}
        handleRemove={(file) => {
          setUploadedFiles(files => files.filter(f => f.key !== file.key));
          // Also delete from S3 or your storage if needed
          deleteFileFromStorage(file.key);
        }}
      />
    </div>
  );
}

// Helper functions (implement these based on your backend)
async function getPresignedUrl(filename, contentType) {
  const response = await fetch('/api/get-upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, contentType })
  });
  return response.json();
}

async function uploadToS3(file, presignedUrl, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('S3 upload network error'));
    
    xhr.open('PUT', presignedUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}

async function notifyBackendOfUpload(fileKey, fileName) {
  const response = await fetch('/api/confirm-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: fileKey, name: fileName })
  });
  return response.json();
}

async function deleteFileFromStorage(fileKey) {
  await fetch(`/api/delete-file/${fileKey}`, { method: 'DELETE' });
}
```

## Usage with jQuery / Vanilla JavaScript

```html
<!-- Include the script -->
<script src="path/to/shotupload.min.js"></script>

<div id="upload-container"></div>

<script>
  $(document).ready(function() {
    // Using jQuery
    const uploader = new ShotUpload.VanillaImageUploader('#upload-container', {
      url: '/api/upload',
      onSuccess: function(response, file) {
        console.log('Upload successful:', response);
      },
      onError: function(error, file) {
        console.error('Upload failed:', error);
      }
    });
  });
  
  // Or with vanilla JavaScript
  const uploader = new ShotUpload.VanillaImageUploader(
    document.getElementById('upload-container'),
    {
      url: '/api/upload',
      onSuccess: function(response, file) {
        console.log('Upload successful:', response);
      }
    }
  );
</script>
```

## Configuration Options

### ImageUploader Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| uploadUrl | string | '/upload' | The URL to upload files to |
| maxSize | number | 5MB | Maximum file size in bytes |
| allowedTypes | string[] | ['image/jpeg', 'image/png', 'image/gif'] | Array of allowed MIME types |
| buttonText | string | 'Select image' | Text for the upload button |
| dropzoneText | string | 'drop file here or' | Text for the dropzone area |
| showPreview | boolean | true | Whether to show image previews |
| onProgress | function | null | Callback for upload progress |
| onSuccess | function | null | Callback for successful upload |
| onError | function | null | Callback for upload errors |
| enableWebcam | boolean | true | Enable webcam capture functionality |
| webcamButtonText | string | 'Take Photo' | Text for the webcam button |
| templateImage | string\|ReactNode | null | Template image or SVG to overlay |
| height | string\|number | '100%' | Height of the uploader container |
| width | string\|number | '100%' | Width of the uploader container |
| value | object | null | Pre-populated file data |
| handleRemove | function | null | Custom handler for file removal |
| getPublicImageUrl | function | null | Function to get public URL for images |
| styles | object | {} | Custom styling options |

### FileUploader Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| uploadUrl | string | '/upload' | The URL to upload files to |
| maxSize | number | 5MB | Maximum file size in bytes |
| allowedTypes | string[] | ['*/*'] | Array of allowed MIME types |
| multiple | boolean | false | Allow multiple file selection |
| buttonText | string | 'Select file' | Text for the upload button |
| dropzoneText | string | 'drop file here or' | Text for the dropzone area |
| showPreview | boolean | true | Whether to show file previews |
| onProgress | function | null | Callback for upload progress |
| onSuccess | function | null | Callback for successful upload |
| onError | function | null | Callback for upload errors |
| handleUpload | function | null | Custom upload handler |
| allowRemove | boolean | true | Allow removal of uploaded files |
| height | string\|number | null | Height of the uploader container |
| value | object\|array | null | Pre-populated file data |
| allowDownload | boolean | false | Allow downloading of uploaded files |
| getDownloadableUrl | function | null | Function to get downloadable URL |
| handleRemove | function | null | Custom handler for file removal |
| styles | object | {} | Custom styling options |

## Styling Options

Both components accept a `styles` prop for customization:

| Style Property | Description |
|---------------|-------------|
| primaryColor | Primary color for buttons and highlights |
| hoverColor | Color on hover for interactive elements |
| borderColor | Color of the container border |
| borderColorActive | Color of the border when active |
| backgroundColor | Background color of the container |
| textColor | Color of the text |

## Building from Source

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run development mode with hot reloading
npm run dev
```

## License

MIT
