import { VanillaImageUploader } from './component';

export { VanillaImageUploader };

// Create a global for easier usage with script tags
if (typeof window !== 'undefined') {
  window.ShotUpload = {
    VanillaImageUploader
  };
}
