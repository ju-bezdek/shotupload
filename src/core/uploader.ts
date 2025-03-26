import { UploaderOptions } from './types';

export class Uploader {
  private options: UploaderOptions;

  constructor(options: UploaderOptions) {
    this.options = options;
  }

  uploadFile(file: File): void {
    const { uploadUrl, maxSize, allowedTypes, onProgress, onSuccess, onError } = this.options;

    // Check file size
    if (file.size > maxSize) {
      onError && onError(new Error(`File size exceeds maximum allowed size of ${maxSize} bytes`), file);
      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      onError && onError(new Error(`File type ${file.type} is not allowed`), file);
      return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    
    formData.append('file', file);

    xhr.open('POST', uploadUrl as string, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percentage = Math.round((e.loaded / e.total) * 100);
        onProgress(percentage, file);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          onSuccess && onSuccess(response, file);
        } catch (e) {
          onSuccess && onSuccess(xhr.responseText, file);
        }
      } else {
        onError && onError(new Error(`Upload failed with status ${xhr.status}`), file);
      }
    };

    xhr.onerror = () => {
      onError && onError(new Error('Upload failed due to network error'), file);
    };

    xhr.send(formData);
  }
}
