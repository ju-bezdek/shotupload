import { FileInputOptions, DropZone } from './types';

export function createFileInput(options: FileInputOptions = {}): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  
  if (options.multiple) {
    input.multiple = true;
  }
  
  if (options.accept) {
    input.accept = options.accept;
  }
  
  return input;
}

export function createDropZone(element: HTMLElement): DropZone {
  let dropHandler: ((files: FileList) => void) | null = null;
  
  const preventDefault = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragOver = (e: DragEvent) => {
    preventDefault(e);
    element.classList.add('shotupload-dragover');
  };
  
  const handleDragLeave = (e: DragEvent) => {
    preventDefault(e);
    element.classList.remove('shotupload-dragover');
  };
  
  const handleDrop = (e: DragEvent) => {
    preventDefault(e);
    element.classList.remove('shotupload-dragover');
    
    if (e.dataTransfer?.files && dropHandler) {
      dropHandler(e.dataTransfer.files);
    }
  };
  
  element.addEventListener('dragover', handleDragOver as EventListener);
  element.addEventListener('dragleave', handleDragLeave as EventListener);
  element.addEventListener('drop', handleDrop as EventListener);
  
  return {
    onDrop: (handler: (files: FileList) => void) => {
      dropHandler = handler;
    },
    destroy: () => {
      element.removeEventListener('dragover', handleDragOver as EventListener);
      element.removeEventListener('dragleave', handleDragLeave as EventListener);
      element.removeEventListener('drop', handleDrop as EventListener);
      dropHandler = null;
    }
  };
}
