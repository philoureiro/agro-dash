import CircularProgress from '@mui/material/CircularProgress';

import { FullSizeCentered } from '@components';

export function Loading() {
  return (
    <FullSizeCentered>
      <CircularProgress />
    </FullSizeCentered>
  );
}
