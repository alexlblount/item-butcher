import { useState } from 'react';
import ReactJson from 'react-json-view';
import {
  ItemDetails,
  parseInitialInfo,
} from '@features/imageParsing/transformText';
import { preprocessImage } from '@features/imageCapture/preprocessImage';
import { recognizeTextFromImage } from '@features/imageParsing/recognizeText';
import CaptureContainer from '@features/imageCapture/CaptureContainer';
import styles from './TestPage.module.css';

export default function TestPage() {
  const [extractedText, setExtractedText] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [iconDimensions, setIconDimensions] = useState<[number, number]>([
    0, 0,
  ]);
  const [imageSrc, setImageSrc] = useState('');
  const [itemDetails, setItemDetails] = useState<ItemDetails>();
  const [pastedImageSrc, setPastedImageSrc] = useState('');

  const readImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPastedImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImagePaste = async (imageFile: File) => {
    // reset state
    setExtractedText('');
    setIconDimensions([0, 0]);
    setIconUrl('');
    setImageSrc('');
    setItemDetails(undefined);

    // read image
    readImageFile(imageFile);

    // Create an Image element to work with the file
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);

    image.onload = async () => {
      // Preprocess the image (includes grayscale conversion, thresholding, etc.)
      const { canvas, cornerImageUrl, cornerHeight, cornerWidth } =
        preprocessImage(image);
      setIconUrl(cornerImageUrl);
      setIconDimensions([Math.round(cornerHeight), Math.round(cornerWidth)]);

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
      <div className={styles.testPage}>
        <div style={{ textAlign: 'center' }}>
          <h1 className={styles.diabloTitle}>Item Recognition Test Page</h1>
          <p className={styles.diabloText}>
            Click anywhere on the page and paste an image of an item to test
            processing.
          </p>
        </div>
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
        <div style={{ position: 'relative' }}>
          {itemDetails && iconUrl && (
            <div
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                opacity: 0.5,
                zIndex: 100,
              }}
            >
              <img
                src={iconUrl}
                alt="Icon"
                style={{ border: '2px solid gold' }}
              />
              <div style={{ textAlign: 'center' }}>
                {iconDimensions[0]} x {iconDimensions[1]}
              </div>
            </div>
          )}
          {itemDetails && (
            <ReactJson
              displayDataTypes={false}
              displayObjectSize={false}
              quotesOnKeys={false}
              src={itemDetails}
              theme="monokai"
            />
          )}
        </div>
      </div>
    </CaptureContainer>
  );
}
