import { LoadingWrapper, Spinner } from './styles';

export const SpinnerComponent = () => (
  <LoadingWrapper>
    <Spinner data-testid="spinner" />
  </LoadingWrapper>
);
