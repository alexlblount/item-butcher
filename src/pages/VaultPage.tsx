import { selectUniqueSortedItemTypes } from '@features/vault/vaultSlice';
import { useAppSelector } from '@src/state/hooks';
import ItemTile from '@features/vault/ItemTile';
import styles from './VaultPage.module.css';

export default function VaultPage() {
  // The `state` arg is correctly typed as `RootState` already
  const items = useAppSelector((state) => state.vault.items);
  const itemHeaders = useAppSelector(selectUniqueSortedItemTypes);
  return (
    <div id="vault-page" className={styles.vault}>
      {itemHeaders.map((itemHeader) => (
        <div key={itemHeader}>
          <h2>{itemHeader}</h2>
          <div className={styles.container}>
            {items
              .filter((item) => item.itemType === itemHeader)
              .map((item) => (
                <ItemTile key={item.id} item={item} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// export default function VaultPage() {
//   // The `state` arg is correctly typed as `RootState` already
//   const items = useAppSelector((state) => state.vault.items);
//   const itemHeaders = useAppSelector(selectUniqueSortedItemTypes);
//   const dispatch = useAppDispatch();

//   const handleImagePaste = async (imageFile: File) => {
//     // Create an Image element to work with the file
//     const image = new Image();

//     image.onload = async () => {
//       // Preprocess the image (includes grayscale conversion, thresholding, etc.)
//       const { canvas, cornerImageUrl, cornerHeight, cornerWidth } = preprocessImage(image);

//       // Use the preprocessed image for OCR text recognition
//       const text = await recognizeTextFromImage(canvas.toDataURL());

//       // parse the recognized text and add the icon URL
//       const newItem = parseInitialInfo(text);
//       newItem.iconDataUrl = cornerImageUrl;
//       newItem.iconHeight = cornerHeight;
//       newItem.iconWidth = cornerWidth;

//       // add the new item to the redux store
//       dispatch(addItem(newItem));

//       // Clean up the object URL to avoid memory leaks
//       URL.revokeObjectURL(image.src);
//     };

//     image.src = URL.createObjectURL(imageFile);
//   };

//   return (
//     <CaptureContainer onImagePaste={handleImagePaste}>
//       <div id="items-page">
//         <h1>Vault</h1>
//         {itemHeaders.map((itemHeader) => (
//           <div key={itemHeader}>
//             <h2>{itemHeader}</h2>
//             <div className={styles.container}>
//               {items
//                 .filter((item) => item.itemType === itemHeader)
//                 .map((item) => (
//                   <ItemTile key={item.id} item={item} />
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </CaptureContainer>
//   );
// }
