import React, { useState } from 'react';

type ImageInputProps = {
  onImagePaste: (imageFile: File) => void;
};

function ImageInput({ onImagePaste }: ImageInputProps) {
  const [imageSrc, setImageSrc] = useState<string>('');

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.includes('image')) {
        const imageFile = item.getAsFile();
        if (imageFile) {
          onImagePaste(imageFile);
          readImageFile(imageFile);
          break;
        }
      }
    }
  };

  const readImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div onPaste={handlePaste}>
      <div>Paste your image here!</div>
      {imageSrc && (
        <img
          alt="Pasted"
          src={imageSrc}
          style={{ maxWidth: '100%', maxHeight: '800px' }}
        />
      )}
    </div>
  );
}

export default ImageInput;
