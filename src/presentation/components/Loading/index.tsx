import CircularProgress from '@mui/material/CircularProgress';

import { FullSizeCentered } from '..';

function Loading() {
  return (
    <FullSizeCentered>
      <CircularProgress />
    </FullSizeCentered>
  );
}

export default Loading;
