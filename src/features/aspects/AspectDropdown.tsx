import { ChangeEvent } from 'react';
// aliased
import { RootState } from '@src/state/store';
import { useAppSelector, useAppDispatch } from '@src/state/hooks';
import aspectsArray from '@src/assets/aspects.master.json';
// relative
import { selectAspectTypes } from '../vault/vaultSlice';
import { setSelectedAspect } from './aspectSlice';

const aspects = aspectsArray.reduce(
  (acc, item) => {
    acc[item.aspect] = item;
    return acc;
  },
  {} as Record<string, (typeof aspectsArray)[number]>,
);

function getShortAspectName(aspectKey: string) {
  const aspect = aspects[aspectKey];
  return aspect ? aspect.name : aspectKey;
}

// interface AspectDropdownProps {
//   // Define any props here if needed
// }

function AspectDropdown() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state: RootState) => state.aspect.selectedAspect);
  const aspects = useAppSelector(selectAspectTypes);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const aspect = event.target.value;
    dispatch(setSelectedAspect(aspect));
  };

  return (
    <select value={selected} onChange={handleChange}>
      <option value="">Select a Legendary Aspect</option>
      {aspects.map((aspectKey) => (
        <option key={aspectKey} value={aspectKey}>
          {getShortAspectName(aspectKey)}
        </option>
      ))}
    </select>
  );
}

export default AspectDropdown;
