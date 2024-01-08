import { useState } from 'react';
import {
  ItemDetails,
  parseInitialInfo,
} from '@features/imageParsing/transformText';
import { preprocessImage } from '@features/imageCapture/preprocessImage';
import { recognizeTextFromImage } from '@features/imageParsing/recognizeText';
import CaptureContainer from '@features/imageCapture/CaptureContainer';
import styles from './TestPage.module.css';

export default function TestPage() {
  const [pastedImageSrc, setPastedImageSrc] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [itemDetails, setItemDetails] = useState<ItemDetails>();

  const readImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPastedImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImagePaste = async (imageFile: File) => {
    readImageFile(imageFile);

    // Create an Image element to work with the file
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);

    image.onload = async () => {
      // Preprocess the image (includes grayscale conversion, thresholding, etc.)
      const canvas = preprocessImage(image);

      // Use the preprocessed image for OCR
      const text = await recognizeTextFromImage(canvas.toDataURL());
      setExtractedText(text);
      setItemDetails(parseInitialInfo(text));

      // Update the displayed image
      setImageSrc(canvas.toDataURL());

      // Clean up the object URL to avoid memory leaks
      URL.revokeObjectURL(image.src);
    };
  };

  // test
  return (
    <CaptureContainer onImagePaste={handleImagePaste}>
      <h1>Item Recognition Test Page</h1>
      <div className={styles.container}>
        <div className={styles.imageColumn}>
          {pastedImageSrc && (
            <img
              alt="Pasted"
              src={pastedImageSrc}
              style={{ maxWidth: '100%', maxHeight: '500px' }}
            />
          )}
        </div>
        <div className={styles.imageColumn}>
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Processed"
              style={{ maxWidth: '100%', maxHeight: '500px' }}
            />
          )}
        </div>
        <div className={styles.textColumn}>
          <pre className={styles.result}>{extractedText}</pre>
        </div>
      </div>
      <div style={{ textAlign: 'left' }}>
        <pre>{JSON.stringify(itemDetails, null, 2)}</pre>
      </div>
    </CaptureContainer>
  );
}
