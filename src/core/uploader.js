export class Uploader {
  constructor(options = {}) {
    this.options = {
      url: options.url || '/upload',
      maxSize: options.maxSize || 5 * 1024 * 1024, // 5MB
      allowedTypes: options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif'],
      onProgress: options.onProgress || (() => {}),
      onSuccess: options.onSuccess || (() => {}),
      onError: options.onError || (() => {}),
      ...options
    };
  }

  uploadFile(file) {
    if (!this.validateFile(file)) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.options.url, true);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded * 100) / e.total);
        this.options.onProgress(percentage, file);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          this.options.onSuccess(response, file);
        } catch (e) {
          this.options.onSuccess({ url: xhr.responseText }, file);
        }
      } else {
        this.options.onError(xhr.statusText, file);
      }
    });

    xhr.addEventListener('error', () => {
      this.options.onError('Network error', file);
    });

    xhr.send(formData);
  }

  validateFile(file) {
    if (file.size > this.options.maxSize) {
      this.options.onError(`File size exceeds maximum allowed size of ${this.options.maxSize / (1024 * 1024)}MB`, file);
      return false;
    }

    if (!this.options.allowedTypes.includes(file.type)) {
      this.options.onError(`File type ${file.type} is not supported`, file);
      return false;
    }

    return true;
  }
}
