import { Uploader } from '../core/uploader';
import { createDropZone } from '../core/utils';
import { ImageUploaderProps } from '../core/types';



export class VanillaImageUploader {
  private element: HTMLElement;
  private uploader: Uploader;
  private options: ImageUploaderProps;
  private files: File[] = [];
  private progress: Record<string, number> = {};
  private previews: Record<string, string> = {};
  
  constructor(elementOrSelector: string | HTMLElement, options: ImageUploaderProps) {
    if (typeof elementOrSelector === 'string') {
      const el = document.querySelector(elementOrSelector);
      if (!el) {
        throw new Error(`Element with selector "${elementOrSelector}" not found`);
      }
      this.element = el as HTMLElement;
    } else {
      this.element = elementOrSelector;
    }
    
    this.options = {
      ...options,
      uploadUrl: '/upload',
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
      multiple: false,
      buttonText: 'Upload Image',
      dropzoneText: 'or drop files here',
      showPreview: true
    };
    
    this.uploader = new Uploader({
      uploadUrl: this.options.uploadUrl,
      maxSize: this.options.maxSize,
      allowedTypes: this.options.allowedTypes,
      onProgress: this.handleProgress.bind(this),
      onSuccess: this.handleSuccess.bind(this),
      onError: this.handleError.bind(this)
    });
    
    this.initialize();
  }
  
  private initialize() {
    // Add necessary classes
    this.element.classList.add('shotupload-container');
    if (this.options.className) {
      this.element.classList.add(this.options.className);
    }
    
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.accept = this.options.allowedTypes.join(',');
    input.multiple = !!this.options.multiple;
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        this.handleFiles(target.files);
      }
    });
    this.element.appendChild(input);
    
    // Create upload button
    const button = document.createElement('button');
    button.className = 'shotupload-button';
    button.textContent = this.options.buttonText || 'Upload Image';
    button.addEventListener('click', () => input.click());
    this.element.appendChild(button);
    
    // Create dropzone text
    const dropzoneText = document.createElement('div');
    dropzoneText.className = 'shotupload-dropzone-text';
    dropzoneText.textContent = this.options.dropzoneText || 'or drop files here';
    this.element.appendChild(dropzoneText);
    
    // Create preview container
    const previewsContainer = document.createElement('div');
    previewsContainer.className = 'shotupload-previews';
    previewsContainer.style.display = 'none';
    this.element.appendChild(previewsContainer);
    
    // Initialize dropzone
    const dropZone = createDropZone(this.element);
    dropZone.onDrop(this.handleFiles.bind(this));
  }
  
  private handleFiles(fileList: FileList) {
    const filesArray = Array.from(fileList);
    this.files = [...this.files, ...filesArray];
    
    if (this.options.showPreview) {
      filesArray.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === 'string') {
              this.previews[file.name] = e.target.result as string;
              this.updatePreviewsUI();
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    filesArray.forEach(file => {
      this.uploader.uploadFile(file);
    });
  }
  
  private handleProgress(percentage: number, file: File) {
    this.progress[file.name] = percentage;
    this.updatePreviewsUI();
    
    if (this.options.onProgress) {
      this.options.onProgress(percentage, file);
    }
  }
  
  private handleSuccess(response: any, file: File) {
    if (this.options.onSuccess) {
      this.options.onSuccess(response, file);
    }
  }
  
  private handleError(error: Error, file: File) {
    if (this.options.onError) {
      this.options.onError(error, file);
    }
  }
  
  private updatePreviewsUI() {
    if (!this.options.showPreview) return;
    
    const previewsContainer = this.element.querySelector('.shotupload-previews') as HTMLElement;
    if (!previewsContainer) return;
    
    if (this.files.length > 0) {
      previewsContainer.innerHTML = '';
      previewsContainer.style.display = 'flex';
      
      this.files.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'shotupload-preview-item';
        
        if (this.previews[file.name]) {
          const img = document.createElement('img');
          img.src = this.previews[file.name];
          img.alt = file.name;
          img.className = 'shotupload-preview-image';
          previewItem.appendChild(img);
        }
        
        const filename = document.createElement('div');
        filename.className = 'shotupload-filename';
        filename.textContent = file.name;
        previewItem.appendChild(filename);
        
        if (this.progress[file.name] !== undefined && this.progress[file.name] < 100) {
          const progressContainer = document.createElement('div');
          progressContainer.className = 'shotupload-progress';
          
          const progressBar = document.createElement('div');
          progressBar.className = 'shotupload-progress-bar';
          progressBar.style.width = `${this.progress[file.name]}%`;
          
          progressContainer.appendChild(progressBar);
          previewItem.appendChild(progressContainer);
        }
        
        previewsContainer.appendChild(previewItem);
      });
    } else {
      previewsContainer.style.display = 'none';
    }
  }
}

// Export a global instance constructor for vanilla JS
export default VanillaImageUploader;
