import { FullSizeCentered, Input, Select, Text } from '@components';
import { useThemeMode } from '@theme';

export const AddFarmer = () => {
  const { themeMode } = useThemeMode();

  return (
    <>
      <meta name="title" content="Add farmer" />
      <FullSizeCentered>
        <Text variant="h3">Add farmer</Text>

        <Input
          themeMode={themeMode}
          type="text"
          placeholder="Login"
          value={'login'}
          onChange={(e) => {
            console.log(e.target.value);
          }}
          autoComplete="username"
        />
        <Select
          themeMode={themeMode}
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
