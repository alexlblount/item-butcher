import CaptureContainer from '@features/imageCapture/CaptureContainer';
import { preprocessImage } from '@features/imageCapture/preprocessImage';
import { recognizeTextFromImage } from '@features/imageParsing/recognizeText';
import {
  // ItemDetails,
  parseInitialInfo,
} from '@features/imageParsing/transformText';

import { useAppSelector, useAppDispatch } from '@src/state/hooks';
import { decrement, increment } from '@features/vault/vaultSlice';

export default function ItemsPage() {
  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector((state) => state.vault.value);
  const dispatch = useAppDispatch();

  const readImageFile = (file: File) => {
    const reader = new FileReader();
    // reader.onload = (e) => setPastedImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImagePaste = async (imageFile: File) => {
    // read image
    readImageFile(imageFile);

    // Create an Image element to work with the file
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);

    image.onload = async () => {
      // Preprocess the image (includes grayscale conversion, thresholding, etc.)
      const { canvas, cornerImageUrl, cornerHeight, cornerWidth } =
        preprocessImage(image);

      // Use the preprocessed image for OCR
      const text = await recognizeTextFromImage(canvas.toDataURL());
      // setExtractedText(text);
      // setItemDetails(parseInitialInfo(text));

      // Update the displayed image
      // setImageSrc(canvas.toDataURL());

      // Clean up the object URL to avoid memory leaks
      URL.revokeObjectURL(image.src);
    };
  };

  return (
    <CaptureContainer onImagePaste={handleImagePaste}>
      <div id="items-page">
        <h1>Items Page</h1>
        <hr />
        <h2>Redux Test</h2>
        <div>
          <button
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            Increment
          </button>
          <span>{count}</span>
          <button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            Decrement
          </button>
        </div>
      </div>
    </CaptureContainer>
  );
}
