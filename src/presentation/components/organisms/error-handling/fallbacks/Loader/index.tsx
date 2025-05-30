import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function LoaderErrorBoundaryFallback() {
  return (
    <Box>
      <Typography variant="h5">
        Something went wrong with this component loading process... Please try again later
      </Typography>
    </Box>
  );
}
