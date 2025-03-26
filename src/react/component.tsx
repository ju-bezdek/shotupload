import React, { useState, useRef, useEffect } from 'react';
import { Uploader } from '../core/uploader';
import { createDropZone } from '../core/utils';
import { ImageUploaderProps } from '../core/types';

// Style component to inject CSS with custom properties
const StylesInjector: React.FC<{ styles?: ImageUploaderProps['styles'], mirrorWebcam?: boolean }> = ({ styles, mirrorWebcam = true }) => {
  const primaryColor = styles?.primaryColor || '#4a90e2';
  const hoverColor = styles?.hoverColor || '#3a7bc8';
  const borderColor = styles?.borderColor || '#ccc';
  const borderColorActive = styles?.borderColorActive || primaryColor;
  const backgroundColor = styles?.backgroundColor || 'rgba(74, 144, 226, 0.1)';
  const textColor = styles?.textColor || '#666';

  return (
    <style>
      {`
      .shotupload-container {
        border: 2px dashed ${borderColor};
        border-radius: 5px;
        padding: 20px 20px 0px;
        text-align: center;
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        position: relative;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        display: inline-flex;
        flex-direction: column;
        justify-content: flex-end;
        width: auto; /* Change to fit content */
        max-width: 100%; /* Ensure it doesn't overflow the parent */
        min-width: 200px;
      }
      
      .shotupload-container-with-bg {
        background-color: transparent;
      }
      
      .shotupload-container-with-bg::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.3;
        pointer-events: none;
        z-index: 0;
      }
      
      .shotupload-container-content {
        position: relative;
        z-index: 1;
        bottom: 0px;
        display: flex;
        flex-direction: column;
        min-width: 200px;
      }
      
      .shotupload-dragover {
        border-color: ${borderColorActive};
        background-color: ${backgroundColor};
      }
      
      .shotupload-button {
        background-color: ${primaryColor};
        color: white;
        border: none;
        padding: 2px 10px;
        display: flex;
        align-items: center;
        
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 5px;
        margin-right: 10px;
      }
      
      .shotupload-button:hover {
        background-color: ${hoverColor};
      }
      
      .shotupload-dropzone-text {
        color: ${textColor};
        margin-bottom: 5px;
        background-color: rgba(255, 255, 255, 0.7);
        padding: 5px;
        border-radius: 4px; 
        width: auto;
        margin: 0 auto;
      }
      
      .shotupload-previews {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        gap: 15px;
      }
      
      .shotupload-preview-item {
        width: 150px;
        position: relative;
        border: 1px solid #eee;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .shotupload-preview-image {
        width: 100%;
        height: auto;
        display: block;
      }
      
      .shotupload-filename {
        font-size: 12px;
        padding: 5px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      
      .shotupload-progress {
        height: 5px;
        background-color: #eee;
        width: 100%;
      }
      
      .shotupload-progress-bar {
        height: 100%;
        background-color: ${primaryColor};
        transition: width 0.3s ease;
      }
      
      .shotupload-webcam-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      
      .shotupload-webcam-modal {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .shotupload-webcam-video {
        width: 100%;
        height: auto;
        ${mirrorWebcam ? 'transform: scaleX(-1);' : ''}
        position: relative;
      }
      
      .shotupload-webcam-canvas {
        display: none;
      }
      
      .shotupload-webcam-captured-img {
        width: 100%;
        height: auto;
      }
      
      .shotupload-webcam-buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }
      
      .shotupload-template-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
      }
      
      .shotupload-template-image {
        width: 100%;
        height: 100%;
        opacity: 0.5;
      }
      
      .shotupload-webcam-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 10;
        width: 80%;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .shotupload-webcam-overlay svg,
      .shotupload-webcam-overlay img {
        width: 100%;
        height: auto;
        opacity: 0.5;
      }
      
      .shotupload-webcam-wrapper {
        position: relative;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        overflow: hidden;
      }
      .shotupload-button-container {
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      
      .shotupload-svg-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 0;
        opacity: 0.3;
        pointer-events: none;
      }
      
      .shotupload-svg-background svg {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .shotupload-clear-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(255, 255, 255, 0.7);
        color: #666;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        z-index: 10;
        padding: 0;
        line-height: 1;
      }
      
      .shotupload-clear-button:hover {
        background-color: rgba(255, 255, 255, 0.9);
        color: #333;
      }
      `}
    </style>
  );
};

// Helper component to render template image
const TemplateImage: React.FC<{
  template: string | React.ReactNode;
  className?: string;
}> = ({ template, className = '' }) => {
  if (typeof template === 'string') {
    // Check if it's an SVG string
    if (template.trim().startsWith('<svg')) {
      return (
        <div 
          className={className}
          dangerouslySetInnerHTML={{ __html: template }}
        />
      );
    } else {
      // It's a path to an image
      return (
        <img 
          src={template} 
          alt="Template" 
          className={`shotupload-template-image ${className}`}
        />
      );
    }
  } else {
    // It's a React component
    return (
      <div className={className}>
        {template}
      </div>
    );
  }
};

const WebcamCapture: React.FC<{
  onCapture: (file: File) => void;
  onClose: () => void;
  captureButtonText: string;
  retakeButtonText: string;
  confirmButtonText: string;
  beforeCaptureText: string;
  afterCaptureText: string;
  mirrorWebcam: boolean;
  flipCapturedImage: boolean;
  templateImage?: string | React.ReactNode;
}> = ({
  onCapture,
  onClose,
  captureButtonText,
  retakeButtonText,
  confirmButtonText,
  beforeCaptureText,
  afterCaptureText,
  mirrorWebcam,
  flipCapturedImage,
  templateImage
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Function to stop all tracks in the stream
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };
  useEffect(() => {

    startWebcam();

    // Clean up function that uses the stopWebcam helper
    return () => {
      stopWebcam();
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        if (flipCapturedImage) {
          // Flip the image horizontally if needed
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
        } else {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  const retakeImage = () => {
    startWebcam();
    setCapturedImage(null);
  };

  const confirmImage = () => {
    if (capturedImage) {
      // Convert data URL to Blob
      const binaryString = atob(capturedImage.split(',')[1]);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'image/jpeg' });
      const fileName = `capture_${new Date().getTime()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // Stop webcam before closing
      //stopWebcam();
      onCapture(file);
      onClose();
    }
  };

  // Modified close handler to stop webcam
  const handleClose = () => {
    stopWebcam();
    onClose();
  };

  return (
    <div className="shotupload-webcam-container">
      <div className="shotupload-webcam-modal">
        {!capturedImage ? (
          <>
            <p>{beforeCaptureText}</p>
            <div className="shotupload-webcam-wrapper">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                muted
                className="shotupload-webcam-video"
              />
              {templateImage && (
                <TemplateImage 
                  template={templateImage}
                  className="shotupload-webcam-overlay"
                />
              )}
              <canvas ref={canvasRef} className="shotupload-webcam-canvas" />
            </div>
            <div className="shotupload-webcam-buttons">
              <button 
                className="shotupload-button" 
                onClick={captureImage}
              >
                {captureButtonText}
              </button>
              <button 
                className="shotupload-button" 
                onClick={handleClose}
                style={{ backgroundColor: '#999' }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p>{afterCaptureText}</p>
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="shotupload-webcam-captured-img" 
              style={{ transform: flipCapturedImage ? 'scaleX(-1)' : 'none' }}
            />
            <div className="shotupload-webcam-buttons">
              <button 
                className="shotupload-button" 
                onClick={retakeImage}
              >
                
                {retakeButtonText}
              </button>
              <button 
                className="shotupload-button" 
                onClick={confirmImage}
              >
                
                {confirmButtonText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ImageUploader: React.FC<ImageUploaderProps> = (props) => {
  const {
    uploadUrl = '/upload',
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    multiple = false, // This will be ignored as we're forcing single file
    onProgress,
    onSuccess,
    onError,
    className = '',
    buttonText = 'Select image',
    dropzoneText = 'drop files here or',
    showPreview = true,
    styles = {},
    // Webcam props with defaults
    enableWebcam = true,
    webcamButtonText = 'Take Photo',
    beforeCaptureText = 'Position yourself in the camera',
    afterCaptureText = 'How does this look?',
    retakeButtonText = 'Retake',
    captureButtonText = 'Capture',
    confirmButtonText = 'Use This Photo',
    mirrorWebcam = true,
    flipCapturedImage = false,
    // Template image props
    templateImage,
    // Dimension props with defaults
    height = '100%',
    width = '100%',
    // Custom upload handler
    handleUpload,
  } = props;

  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploaderRef = useRef<Uploader | null>(null);

  useEffect(() => {
    uploaderRef.current = new Uploader({
      uploadUrl,
      maxSize,
      allowedTypes,
      onProgress: (percentage, file) => {
        setProgress(percentage);
        onProgress && onProgress(percentage, file);
      },
      onSuccess: (response, file) => {
        onSuccess && onSuccess(response, file);
      },
      onError: (error, file) => {
        onError && onError(error, file);
      }
    });

    if (dropzoneRef.current) {
      const dropzone = createDropZone(dropzoneRef.current);
      dropzone.onDrop(handleFiles);
      
      return () => dropzone.destroy();
    }
    
    return undefined;
  }, [uploadUrl, maxSize, allowedTypes, onProgress, onSuccess, onError]);

  const handleFiles = (fileList: FileList) => {
    // Only use the first file, ignore others
    if (fileList.length > 0) {
      const file = fileList[0];
      setCurrentFile(file);
      
      if (showPreview) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === 'string') {
              setPreview(e.target.result);
            }
          };
          reader.readAsDataURL(file);
        }
      }
      
      if (handleUpload) {
        // Use custom upload handler if provided
        handleUpload(file, (percentage) => {
          setProgress(percentage);
          onProgress && onProgress(percentage, file);
        }).catch(error => {
          onError && onError(error, file);
        });
      } else if (uploaderRef.current) {
        // Use default uploader
        uploaderRef.current.uploadFile(file);
      }
    }
  };

  const handleCapturedImage = (file: File) => {
    const fileList = new DataTransfer();
    fileList.items.add(file);
    handleFiles(fileList.files);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openWebcam = () => {
    setShowWebcam(true);
  };

  const closeWebcam = () => {
    setShowWebcam(false);
  };

  // Get background style based on template image or preview
  const getBackgroundStyle = () => {
    if (preview) {
      return { backgroundImage: `url(${preview})` };
    }
    
    if (!templateImage) return {};
    
    if (typeof templateImage === 'string' && !templateImage.trim().startsWith('<svg')) {
      // Only apply background-image for image URLs, not SVG strings
      return { backgroundImage: `url(${templateImage})` };
    }
    return {};
  };
  
  // Determine if we should render an SVG background element
  const shouldRenderSvgBackground = () => {
    return !preview && templateImage && typeof templateImage === 'string' && templateImage.trim().startsWith('<svg');
  };

  const clearSelectedFile = () => {
    setCurrentFile(null);
    setPreview(null);
    setProgress(0);
    
    // Reset the file input value to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <StylesInjector styles={styles} mirrorWebcam={mirrorWebcam} />
      <div 
        className={`shotupload-container ${templateImage || preview ? 'shotupload-container-with-bg' : ''} ${className}`} 
        ref={dropzoneRef}
        style={{...getBackgroundStyle(), height, width}}
      >
        {shouldRenderSvgBackground() && (
          <div 
            className="shotupload-svg-background"
            dangerouslySetInnerHTML={{ __html: templateImage as string }}
          />
        )}
        
        {/* X button to clear the selected file */}
        {preview && (
          <button 
            className="shotupload-clear-button"
            onClick={clearSelectedFile}
            title="Remove image"
          >
            ✕
          </button>
        )}
        
        <div className="shotupload-container-content">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept={allowedTypes.join(',')}
            multiple={false} // Always single file
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(e.target.files);
              }
            }}
          />
          {/* Only show dropzone text when no file is selected */}
          {!preview && (
            <div className="shotupload-dropzone-text">{dropzoneText}</div>
          )}
          
          
          {/* Only show file selection buttons when no file is selected */}
          {!preview && (
            <div className="shotupload-button-container">
              <button className="shotupload-button flex items-center" onClick={triggerFileInput}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-folder-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 19h-6a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2.5" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
                {buttonText}
              </button>
              
              {enableWebcam && (
                <button className="shotupload-button flex items-center" onClick={openWebcam}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-camera"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
                  {webcamButtonText}
                </button>
              )}
            </div>
          )}
          
          
          {/* Display progress bar when uploading */}
          {currentFile && progress > 0 && progress < 100 && (
            <div className="shotupload-progress" style={{ margin: '10px 0' }}>
              <div 
                className="shotupload-progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        
        {showWebcam && (
          <WebcamCapture 
            onCapture={handleCapturedImage}
            onClose={closeWebcam}
            captureButtonText={captureButtonText}
            retakeButtonText={retakeButtonText}
            confirmButtonText={confirmButtonText}
            beforeCaptureText={beforeCaptureText}
            afterCaptureText={afterCaptureText}
            mirrorWebcam={mirrorWebcam}
            flipCapturedImage={flipCapturedImage}
            templateImage={templateImage}
          />
        )}
      </div>
    </>
  );
};
