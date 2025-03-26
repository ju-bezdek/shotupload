import React from 'react';
import ReactDOM from 'react-dom/client';
import { ImageUploader } from '../react/component.jsx';

export class VanillaImageUploader {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) {
      throw new Error('Element not found');
    }

    this.options = options;
    this.root = null;
    this._init();
  }

  _init() {
    // Create React root and render the React component
    this.root = ReactDOM.createRoot(this.element);
    this._render();
  }

  _render() {
    this.root.render(
      React.createElement(ImageUploader, {
        ...this.options,
        // Pass callbacks that maintain 'this' context
        onProgress: (percentage, file) => {
          if (this.options.onProgress) {
            this.options.onProgress(percentage, file);
          }
        },
        onSuccess: (response, file) => {
          if (this.options.onSuccess) {
            this.options.onSuccess(response, file);
          }
        },
        onError: (error, file) => {
          if (this.options.onError) {
            this.options.onError(error, file);
          }
        }
      })
    );
  }

  // Method to update options
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this._render();
  }

  // Clean up when done
  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}