import { FullSizeCentered, Select, Text } from '@components';

export const AddFarmer = () => {
  return (
    <>
      <meta name="title" content="Add farmer" />
      <FullSizeCentered>
        <Text variant="h3">Add farmer</Text>

        <Select
          label="Select farmer"
          options={[
            { value: 'farmer1', label: 'Farmer 1' },
            { value: 'farmer2', label: 'Farmer 2' },
            { value: 'farmer3', label: 'Farmer 3' },
          ]}
          onChange={() => {}}
          value={''}
        />
      </FullSizeCentered>
    </>
  );
};
