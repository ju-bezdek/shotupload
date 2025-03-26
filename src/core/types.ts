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
}


