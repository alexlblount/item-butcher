import { useState, ChangeEvent } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '@src/state/store';
import { useDispatch } from 'react-redux';
import { setSelectedAspect } from './aspectSlice';
import { useAppSelector } from '@src/state/hooks';
import { selectLegendaryAspectTypes } from '../vault/vaultSlice';

// interface AspectDropdownProps {
//   // Define any props here if needed
// }

function AspectDropdown() {
  const [selected, setSelected] = useState('');
  const dispatch = useDispatch();
  // const aspects = useSelector((state: RootState) => state.vault.uniqueAspects); // Adjust selector as needed
  const aspects = useAppSelector(selectLegendaryAspectTypes);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const aspect = event.target.value;
    setSelected(aspect);
    dispatch(setSelectedAspect(aspect));
  };

  return (
    <select value={selected} onChange={handleChange}>
      <option value="">Select a Legendary Aspect</option>
      {aspects.map((aspect) => (
        <option key={aspect} value={aspect}>
          {aspect}
        </option>
      ))}
    </select>
  );
}

export default AspectDropdown;
