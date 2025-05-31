import { CustomInput, FullSizeCentered, Select, Text } from '@components';

export const AddFarmer = () => {
  return (
    <>
      <meta name="title" content="Add farmer" />
      <FullSizeCentered>
        <Text variant="h3">Add farmer</Text>

        <CustomInput
          type="text"
          placeholder="Login"
          value={'login'}
          onChange={(e) => {
            console.log(e.target.value);
          }}
          autoComplete="username"
        />
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
