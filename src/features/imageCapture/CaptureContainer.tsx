import React, { useState } from 'react';
import styles from './CaptureContainer.module.css';
import Notification from '@features/layout/Notification';

interface CaptureContainerProps extends React.PropsWithChildren {
  onImagePaste: (imageFile: File, setLoading: (load: boolean) => void) => void;
}

function CaptureContainer({ children, onImagePaste }: CaptureContainerProps) {
  const [loading, setLoading] = useState(false);

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.includes('image')) {
        const imageFile = item.getAsFile();
        if (imageFile) {
          onImagePaste(imageFile, (isLoading) => setLoading(isLoading));
          break;
        }
      }
    }
  };

  return (
    <div className={styles.captureContainer} onPaste={handlePaste}>
      {loading && <Notification text="Processing Image..." />}
      {children}
    </div>
  );
}

export default CaptureContainer;
