import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';

import { themeModeState } from './atoms';

export function ThemeGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [themeMode] = useAtom(themeModeState);

  useEffect(() => {
    setReady(true); // Só libera render depois do primeiro read do átomo (que busca do localStorage)
  }, [themeMode]);

  if (!ready) {
    // Pode retornar um splash, skeleton, ou até null para 0 flicker!
    return null;
  }

  return <>{children}</>;
}
