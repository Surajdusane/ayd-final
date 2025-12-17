'use client';

import { useMountedState } from 'react-use';
import { EditFormSheet } from '../components/custom-nodes/form-node/edit-form-sheet';


const SheetProvider = () => {
  const isMounted = useMountedState();
  if (!isMounted) return null;

  return (
    <>
        <EditFormSheet />
    </>
  );
};

export default SheetProvider;