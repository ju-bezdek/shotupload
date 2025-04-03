export interface UploaderOptions {
  uploadUrl?: string;
  maxSize: number;
  allowedTypes: string[];
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (response: any, file: File) => void;
  onError?: (error: Error, file: File) => void;
}

export interface FileInputOptions {
  multiple?: boolean;
  accept?: string;
}

export interface DropZone {
  onDrop: (callback: (files: FileList) => void) => void;
  destroy: () => void;
}

export interface ImageUploaderStyleProps {
  primaryColor?: string;
  hoverColor?: string;
  borderColor?: string;
  borderColorActive?: string;
  backgroundColor?: string;
  textColor?: string;
  // Add other customizable style properties as needed
}

export interface ImageUploaderProps extends UploaderOptions {
  multiple?: boolean; // Kept for backward compatibility but will be ignored
  className?: string;
  buttonText?: string;
  dropzoneText?: string;
  showPreview?: boolean;
  styles?: ImageUploaderStyleProps;
  // Webcam related props
  enableWebcam?: boolean;
  webcamButtonText?: string;
  beforeCaptureText?: string;
  afterCaptureText?: string;
  retakeButtonText?: string;
  captureButtonText?: string;
  confirmButtonText?: string;
  mirrorWebcam?: boolean;
  flipCapturedImage?: boolean;
  
  // Template image to display as overlay (will be replaced by preview when an image is selected)
  templateImage?: string | React.ReactNode;
  
  // Dimension properties
  height?: string | number;
  width?: string | number;
  
  // Custom upload handler
  handleUpload?: (file: File, onProgress: (progress: number) => void) => Promise<void>;
  
  // New properties
  value?: { name: string; key?: string; url?: string; };
  handleRemove?: (file: { name: string; key?: string; url?: string; }) => void;
  getPublicImageUrl?: (file: { name: string; key?: string; url?: string; }) => Promise<string>;
}

export interface FileUploaderProps {
  uploadUrl?: string;
  maxSize?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (response: any, file: File) => void;
  onError?: (error: Error, file: File) => void;
  className?: string;
  buttonText?: string;
  dropzoneText?: string;
  showPreview?: boolean;
  styles?: {
    primaryColor?: string;
    hoverColor?: string;
    borderColor?: string;
    borderColorActive?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  handleUpload?: (file: File, onProgress: (percentage: number) => void) => Promise<any>;
  allowRemove?: boolean;
  height?: number | string;
  // New props
  value?: { name: string; key: string; url?: string; } | Array<{ name: string; key: string; url?: string; }>;
  allowDownload?: boolean;
  getDownloadableUrl?: (file: { name: string; key: string; url: string; }) => Promise<string>;
  handleRemove?: (file: any) => void; // Callback when a file is removed
}


