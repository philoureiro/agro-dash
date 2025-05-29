import CircularProgress from '@mui/material/CircularProgress';

import { FullSizeCentered } from '../styled';

function Loading() {
  return (
    <FullSizeCentered>
      <CircularProgress />
    </FullSizeCentered>
  );
}

export default Loading;
