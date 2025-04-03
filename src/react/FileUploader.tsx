import React, { useState, useRef, useEffect } from 'react';
import { Uploader } from '../core/uploader';
import { createDropZone } from '../core/utils';
import { FileUploaderProps } from '../core/types';

const StylesInjector: React.FC<{ styles?: FileUploaderProps['styles'] }> = ({ styles }) => {
  const primaryColor = styles?.primaryColor || '#4a90e2';
  const hoverColor = styles?.hoverColor || '#3a7bc8';
  const borderColor = styles?.borderColor || '#ccc';
  const borderColorActive = styles?.borderColorActive || primaryColor;
  const backgroundColor = styles?.backgroundColor || 'rgba(74, 144, 226, 0.1)';
  const textColor = styles?.textColor || '#666';

  return (
    <style>
      {`
      .fileupload-container {
        border: 2px dashed ${borderColor};
        border-radius: 5px;
        padding: 5px;
        text-align: center;
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        position: relative;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        max-width: 100%;
        min-width: 200px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      
      .fileupload-container button {
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 4px 8px;
      }
      
      .fileupload-dragover {
        border-color: ${borderColorActive};
        background-color: ${backgroundColor};
      }
      
      .fileupload-container-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
        width: calc(100% - 30px);
      }
      
      .fileupload-button {
        background-color: ${primaryColor};
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      /* Default SVG dropzone (small icon in line with text) */
      .fileupload-svg-dropzone {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        opacity: 0.5;
        overflow: hidden; /* Add overflow control */
      }
      
      .fileupload-svg-dropzone svg {
        width: 24px; /* Set fixed width instead of auto */
        height: 24px; /* Set fixed height instead of auto */
        min-width: 24px;
        max-width: 100%; /* Ensure it doesn't exceed container */
      }
      
      /* When container has explicit height */
      .has-height .fileupload-container {
        flex-direction: column;
      }
      
      .has-height .fileupload-svg-dropzone {
        width: 100%;
        flex: 1;
        margin: 0 0 10px 0;
        padding-bottom: 10px;
      }
      
      .has-height .fileupload-svg-dropzone svg {
        width: 80px; /* Set appropriate width */
        height: 80px; /* Set appropriate height */
        max-width: 100%; /* Ensure it doesn't exceed container width */
        max-height: 100%; /* Ensure it doesn't exceed container height */
        min-width: 20px;
        min-height: 20px;
      }
      
      .fileupload-button:hover {
        background-color: ${hoverColor};
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
      
      .fileupload-dropzone-text {
        color: ${textColor};
        background-color: transparent;
        padding: 5px;
        border-radius: 4px;
        margin: 0;
        font-size: 14px;
        display: inline;
        font-weight: 600;
      }
      
      .fileupload-dropzone-text button {
        display: flex;
        gap: 5px;
      }
      
      .fileupload-previews {
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
        
      }
      .fileupload-preview-item svg {
        opacity: 0.5;
        min-width: 24px;
        min-height: 24px;
        max-width: 80%;
        max-height: 80%;
        height: 20px;
        width: 20px; /* Add explicit width */
      }
       .has-height .fileupload-preview-item svg {
        height: auto;
        width: auto; /* Fix typo: 'wight' -> 'width' */
      }
      .fileupload-preview-item {
        width: 100%;
        position: relative;
        border: 1px solid #606060;
        background-color: #EFEFEF79;
        border-radius: 4px;
        overflow: hidden;
        padding: 2px 2px 2px 8px;
        flex-direction: row;
        display: flex;
        justify-content: center;
        align: center;
      }
      .fileupload-preview-label{
        display: flex;
        justify-content: center;
        align-items: center;
        }
      
      .fileupload-preview-image {
        width: 100%;
        height: auto;
        display: block;
      }
      
      .fileupload-filename {
        font-size: 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;
        text-align: left;
        font-weight: 600;
      }
      
      .fileupload-progress {
        height: 5px;
        background-color: #eee;
        width: 100%;
      }
      
      .fileupload-progress-bar {
        height: 100%;
        background-color: ${primaryColor};
        transition: width 0.3s ease;
      }
      
      .remove-file-button {
        background-color: transparent;
        color: #888;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-left: 10px;
        transition: all 0.2s ease;
      }
      
      .remove-file-button:hover {
        background-color: rgba(0,0,0,0.05);
        color: #444;
      }
      `}
    </style>
  );
};

export const FileUploader: React.FC<FileUploaderProps> = (props) => {
  const {
    uploadUrl = '/upload',
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['*/*'],
    multiple = false,
    onProgress,
    onSuccess,
    onError,
    className = '',
    buttonText = 'Select file',
    dropzoneText = 'drop file here or',
    showPreview = true,
    styles = {},
    handleUpload,
    allowRemove = true,
    height,
    value,
    allowDownload = false,
    getDownloadableUrl,
    handleRemove,
  } = props;

  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  });
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

  useEffect(() => {
    if (value) {
      setUploadedFiles(Array.isArray(value) ? value : [value]);
    } else {
      setUploadedFiles([]);
    }
  }, [value]);

  const handleFiles = (fileList: FileList) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      setCurrentFile(file);
      setUploadedFiles([...uploadedFiles, file]);
      
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
        handleUpload(file, (percentage) => {
          setProgress(percentage);
          onProgress && onProgress(percentage, file);
        }).catch(error => {
          onError && onError(error, file);
        });
      } else if (uploaderRef.current) {
        uploaderRef.current.uploadFile(file);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearSelectedFile = () => {
    setCurrentFile(null);
    setPreview(null);
    setProgress(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (file: any) => {
    setUploadedFiles(uploadedFiles.filter(f => f !== file));
    if (currentFile === file) {
      clearSelectedFile();
    }
    
    // Call the handleRemove callback if provided
    if (handleRemove) {
      handleRemove(file);
    }
  };

  const handleDownload = (file: any) => {
    let downloadUrl = file.url;
    
    if (getDownloadableUrl) {
      downloadUrl = getDownloadableUrl(file);
    }
    
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Determine if we should use the height-specific layout
  const hasHeight = height !== undefined && height !== null;
  const containerStyle = hasHeight ? { height: typeof height === 'number' ? `${height}px` : height } : {};

  return (
    <div className={hasHeight ? 'has-height' : ''}>
      <StylesInjector styles={styles} />
      <div 
        className={`fileupload-container ${className}`} 
        ref={dropzoneRef}
        style={containerStyle}
      >
        {uploadedFiles.length > 0 && (
          <div className="fileupload-previews">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="fileupload-preview-item">
                
                <svg  xmlns="http://www.w3.org/2000/svg"    viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>
                <div className="fileupload-preview-label">
                <div className="fileupload-filename">{file.name}</div>
                <div style={{ display: 'flex' }}>
                  {allowDownload && (
                    <button 
                      className="download-file-button"
                      onClick={() => handleDownload(file)}
                      title="Download file"
                      style={{
                        marginRight: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  )}
                  {allowRemove && (
                    <button 
                      className="remove-file-button"
                      onClick={() => removeFile(file)}
                      title="Remove file"
                    >
                      ✕
                    </button>
                  )}
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!uploadedFiles?.length &&  <div className="fileupload-svg-dropzone">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-upload">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
            <path d="M7 9l5 -5l5 5" />
            <path d="M12 4l0 12" />
          </svg>
        </div>}
        <div className="fileupload-container-content">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept={allowedTypes.join(',')}
            multiple={multiple}
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(e.target.files);
              }
            }}
          />
          
          {currentFile && progress > 0 && progress < 100 && (
            <div className="fileupload-progress" style={{ margin: '10px 0', width: '100%' }}>
              <div 
                className="fileupload-progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          {(!uploadedFiles?.length || multiple) && (
            <>
              <div className="fileupload-dropzone-text">{dropzoneText}</div>
              <button className="fileupload-button" onClick={triggerFileInput}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-folder-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 19h-6a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2.5" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
                {buttonText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
