import React from 'react';
import styles from './CaptureContainer.module.css';

interface CaptureContainerProps extends React.PropsWithChildren {
  onImagePaste: (imageFile: File) => void;
}

function CaptureContainer({ children, onImagePaste }: CaptureContainerProps) {
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.includes('image')) {
        const imageFile = item.getAsFile();
        if (imageFile) {
          onImagePaste(imageFile);
          break;
        }
      }
    }
  };

  return (
    <div className={styles.captureContainer} onPaste={handlePaste}>
      {children}
    </div>
  );
}

export default CaptureContainer;
