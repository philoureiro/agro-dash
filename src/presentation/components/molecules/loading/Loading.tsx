import CircularProgress from '@mui/material/CircularProgress';

import { FullSizeCentered } from '../full-size-centered';

function Loading() {
  return (
    <FullSizeCentered>
      <CircularProgress />
    </FullSizeCentered>
  );
}

export default Loading;
