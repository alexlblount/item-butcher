import CaptureContainer from '@features/imageCapture/CaptureContainer';
import { preprocessImage } from '@features/imageCapture/preprocessImage';
import { recognizeTextFromImage } from '@features/imageParsing/recognizeText';
import {
  // ItemDetails,
  parseInitialInfo,
} from '@features/imageParsing/transformText';

import { useAppSelector, useAppDispatch } from '@src/state/hooks';
import { addItem } from '@features/vault/vaultSlice';
import ItemCard from '@features/vault/ItemCard';
import styles from './ItemsPage.module.css';

export default function ItemsPage() {
  // The `state` arg is correctly typed as `RootState` already
  const items = useAppSelector((state) => state.vault.items);
  const dispatch = useAppDispatch();

  const handleImagePaste = async (imageFile: File) => {
    // Create an Image element to work with the file
    const image = new Image();

    image.onload = async () => {
      // Preprocess the image (includes grayscale conversion, thresholding, etc.)
      const { canvas, cornerImageUrl, cornerHeight, cornerWidth } =
        preprocessImage(image);

      // Use the preprocessed image for OCR text recognition
      const text = await recognizeTextFromImage(canvas.toDataURL());

      // parse the recognized text and add the icon URL
      const newItem = parseInitialInfo(text);
      newItem.iconDataUrl = cornerImageUrl;
      newItem.iconHeight = cornerHeight;
      newItem.iconWidth = cornerWidth;

      // add the new item to the redux store
      dispatch(addItem(newItem));

      // Clean up the object URL to avoid memory leaks
      URL.revokeObjectURL(image.src);
    };

    image.src = URL.createObjectURL(imageFile);
  };

  return (
    <CaptureContainer onImagePaste={handleImagePaste}>
      <div id="items-page">
        <h1>Items Page</h1>
        <hr />
        <div className={styles.container}>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </CaptureContainer>
  );
}
