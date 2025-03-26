# ShotUpload SDK

A JavaScript library with an embeddable picture upload component that works with both React and jQuery applications.

## Installation

```bash
npm install shotupload-sdk
```

## Usage with React

```jsx
import React from 'react';
import { ImageUploader } from 'shotupload-sdk/react';

function App() {
  return (
    <div>
      <h1>Upload Your Images</h1>
      <ImageUploader 
        url="/api/upload"
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

Both the React and Vanilla components accept the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| url | string | '/upload' | The URL to upload files to |
| maxSize | number | 5MB | Maximum file size in bytes |
| allowedTypes | string[] | ['image/jpeg', 'image/png', 'image/gif'] | Array of allowed MIME types |
| multiple | boolean | false | Allow multiple file selection |
| buttonText | string | 'Upload Image' | Text for the upload button |
| dropzoneText | string | 'or drop files here' | Text for the dropzone area |
| showPreview | boolean | true | Whether to show image previews |
| onProgress | function | null | Callback for upload progress |
| onSuccess | function | null | Callback for successful upload |
| onError | function | null | Callback for upload errors |

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
