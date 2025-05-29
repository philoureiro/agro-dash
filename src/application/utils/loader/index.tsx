import { loader as loaderDefaultOptions } from '@/config';
import Loading from '@/presentation/components/Loading';

import { asyncComponentLoader } from './loader';
import type { AnyProps, LoadComponent, LoaderDefaultOptions } from './types';

export const configuredAsyncComponentLoader = (
  loadComponent: LoadComponent,
  additionalProps: AnyProps = {},
  loaderOptions: LoaderDefaultOptions = loaderDefaultOptions,
  FallbackWaiting = Loading,
) => asyncComponentLoader(loadComponent, additionalProps, loaderOptions, FallbackWaiting);

export { loaderDefaultOptions };
export default configuredAsyncComponentLoader;
