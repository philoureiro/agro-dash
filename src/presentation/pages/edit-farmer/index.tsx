import { Link } from 'react-router';

import { Button, Typography } from '@mui/material';

import { FullSizeCentered } from '@components';

export default function EditFarmer() {
  return (
    <>
      <meta
        name="title"
        content="
      Edit Farmer"
      />
      <FullSizeCentered>
        <Typography variant="h3">Edit Farmer</Typography>
        <Button
          to={`/${Math.random().toString()}`}
          component={Link}
          variant="outlined"
          sx={{ mt: 4 }}
          size="small"
          color="warning"
        >
          Whant to check 404?
        </Button>
      </FullSizeCentered>
    </>
  );
}
