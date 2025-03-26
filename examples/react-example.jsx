import React, { useState } from 'react';
import { ImageUploader } from '../src/react';

export const ReactExample = () => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleSuccess = (response, file) => {
    setUploadedImages(prev => [...prev, { 
      url: response.url,
      name: file.name,
      size: file.size
    }]);
  };

  return (
    <div className="example-container">
      <h1>React Image Uploader Example</h1>
      
      <ImageUploader 
        url="https://httpbin.org/post" // Mock API endpoint for testing
        maxSize={10 * 1024 * 1024} // 10MB
        multiple={true}
        buttonText="Select Images"
        dropzoneText="or drag and drop your images here"
        onProgress={(percentage, file) => {
          console.log(`${file.name} - ${percentage}%`);
        }}
        onSuccess={handleSuccess}
        onError={(error, file) => {
          console.error(`Error uploading ${file.name}: ${error}`);
        }}
      />
      
      {uploadedImages.length > 0 && (
        <div className="uploaded-images">
          <h2>Uploaded Images</h2>
          <ul>
            {uploadedImages.map((image, index) => (
              <li key={index}>
                <a href={image.url} target="_blank" rel="noopener noreferrer">
                  {image.name} ({Math.round(image.size / 1024)} KB)
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
