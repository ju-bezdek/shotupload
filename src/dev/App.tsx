import React, { useState } from 'react';
import { ImageUploader } from '../react/ImageUploader';
import { FileUploader } from '../react/FileUploader';

export const App: React.FC = () => {
  // Mock server endpoint (it will fail in this demo, but we can see the progress)
  const [mockEndpoint, setMockEndpoint] = useState('/upload');
  const [showPreview, setShowPreview] = useState(true);
  const [multiple, setMultiple] = useState(false);
  
  const [uploadStatus, setUploadStatus] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  
  const handleProgress = (percentage: number, file: File) => {
    console.log(`Upload progress for ${file.name}: ${percentage}%`);
    setUploadStatus({ message: `Uploading ${file.name}: ${percentage}%`, type: 'info' });
  };
  
  const handleSuccess = (response: any, file: File) => {
    console.log(`Upload success for ${file.name}:`, response);
    setUploadStatus({ message: `Successfully uploaded ${file.name}`, type: 'success' });
  };
  
  const handleError = (error: Error, file: File) => {
    console.error(`Upload error for ${file.name}:`, error);
    setUploadStatus({ message: `Error uploading ${file.name}: ${error.message}`, type: 'error' });
  };

  return (
    <div className="container">
      <header>
        <h1>ShotUpload SDK Demo</h1>
      </header>
      
      <section className="demo-section">
        <h2 className="section-title">ImageUploader Component</h2>
        
        {uploadStatus && (
          <div 
            style={{ 
              padding: '10px', 
              margin: '0 0 20px 0', 
              backgroundColor: uploadStatus.type === 'success' ? '#e6f7e6' : 
                uploadStatus.type === 'error' ? '#ffebee' : '#e3f2fd',
              border: `1px solid ${uploadStatus.type === 'success' ? '#a5d6a7' : 
                uploadStatus.type === 'error' ? '#ef9a9a' : '#90caf9'}`,
              borderRadius: '4px'
            }}
          >
            {uploadStatus.message}
          </div>
        )}
        <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', justifyContent: 'center', width: '100px' }}>
        <ImageUploader
          uploadUrl={mockEndpoint}
          maxSize={10 * 1024 * 1024} // 10MB
          value={
            { name: "test", key: "test"}
          }
          allowedTypes={['image/jpeg', 'image/png', 'image/gif']}
          getPublicImageUrl={(file:any) => {
            // Simulate a 5 second delay and then return the URL
            return new Promise((resolve) => {
              console.log(`Preparing download for ${file.name}...`);
              setUploadStatus({ message: `Preparing download for ${file.name}...`, type: 'info' });
              
              setTimeout(() => {
                
                console.log(`Download ready for ${file.name}`);
                setUploadStatus({ message: `Download ready for ${file.name}`, type: 'success' });
                resolve("https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/1200px-Google_Images_2015_logo.svg.png");
              }, 5000);
            });
          }}
          multiple={multiple}
          templateImage="/headshot_down.svg"
          onProgress={handleProgress}
          onSuccess={handleSuccess}
          onError={handleError}
          height={"300px"}
          styles={{
            primaryColor: '#50022B'
          }}
          showPreview={showPreview}
        />
        </div>
        
        <div className="controls">
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input 
                type="checkbox" 
                checked={showPreview} 
                onChange={(e) => setShowPreview(e.target.checked)} 
              />
              Show Previews
            </label>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input 
                type="checkbox" 
                checked={multiple} 
                onChange={(e) => setMultiple(e.target.checked)} 
              />
              Allow Multiple Files
            </label>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>
              Mock Endpoint:
              <input 
                type="text" 
                value={mockEndpoint} 
                onChange={(e) => setMockEndpoint(e.target.value)}
                style={{ marginLeft: '10px', width: '250px', padding: '5px' }}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="demo-section">
        <h2 className="section-title">FileUploader Component</h2>
        
        {uploadStatus && (
          <div 
            style={{ 
              padding: '10px', 
              margin: '0 0 20px 0', 
              backgroundColor: uploadStatus.type === 'success' ? '#e6f7e6' : 
                uploadStatus.type === 'error' ? '#ffebee' : '#e3f2fd',
              border: `1px solid ${uploadStatus.type === 'success' ? '#a5d6a7' : 
                uploadStatus.type === 'error' ? '#ef9a9a' : '#90caf9'}`,
              borderRadius: '4px'
            }}
          >
            {uploadStatus.message}
          </div>
        )}
        <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', justifyContent: 'center', width: 'auto', height:"auto" }}>
        <FileUploader
          //uploadUrl={mockEndpoint}
          value={[
            { name: "test", key: "test", url: "/test" }
          ]}
          //handleRemove={}
          maxSize={10 * 1024 * 1024} // 10MB
          height={"150px"}
          //allowedTypes={[ "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
          //multiple={multiple}
          multiple={false}
         handleUpload={async (file, onProgress) => {}}
          styles={{
            primaryColor: '#50022B'
          }}
          showPreview={showPreview}
        />
        </div>
        
        <div className="controls">
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input 
                type="checkbox" 
                checked={showPreview} 
                onChange={(e) => setShowPreview(e.target.checked)} 
              />
              Show Previews
            </label>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input 
                type="checkbox" 
                checked={multiple} 
                onChange={(e) => setMultiple(e.target.checked)} 
              />
              Allow Multiple Files
            </label>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>
              Mock Endpoint:
              <input 
                type="text" 
                value={mockEndpoint} 
                onChange={(e) => setMockEndpoint(e.target.value)}
                style={{ marginLeft: '10px', width: '250px', padding: '5px' }}
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};
