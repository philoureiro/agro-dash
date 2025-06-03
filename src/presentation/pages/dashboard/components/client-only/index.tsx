import { useEffect, useState } from 'react';

/**
 * Componente que garante que o conteúdo só será renderizado após o componente
 * estar montado no browser (Client-Side Only).
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}
