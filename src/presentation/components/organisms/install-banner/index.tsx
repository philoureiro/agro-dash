/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { Button } from '@components';
import { usePWAInstallPrompt } from '@hooks';

import { BannerContainer, CloseButton } from './styles';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isIos() {
  return (
    typeof window !== 'undefined' &&
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
  );
}
function isInStandaloneMode() {
  return (
    typeof window !== 'undefined' &&
    'standalone' in window.navigator &&
    (window.navigator as any).standalone
  );
}

export function InstallBanner() {
  const { deferredPrompt, isInstalled } = usePWAInstallPrompt();
  const [showIosBanner, setShowIosBanner] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (isIos() && !isInStandaloneMode()) {
      setShowIosBanner(true);
    }
  }, []);

  if (typeof window === 'undefined') return null;
  if (isInstalled || closed) return null;

  if (showIosBanner) {
    return (
      <BannerContainer>
        <CloseButton onClick={() => setClosed(true)}>×</CloseButton>
        <span style={{ flex: 1 }}>
          Para instalar o app, toque no <b>compartilhar</b> <span style={{ fontSize: 24 }}>⬆️</span>{' '}
          e depois em <b>Adicionar à Tela de Início</b>
        </span>
      </BannerContainer>
    );
  }

  if (!deferredPrompt) return null;

  return (
    <BannerContainer>
      <CloseButton onClick={() => setClosed(true)}>×</CloseButton>
      <span style={{ flex: 1 }}>Adicione o AgroDash à tela inicial!</span>
      <Button
        style={{
          width: 180,
        }}
        onClick={async () => {
          const promptEvent = deferredPrompt as BeforeInstallPromptEvent;
          if (promptEvent?.prompt && promptEvent?.userChoice) {
            await promptEvent.prompt();
            await promptEvent.userChoice;
            setClosed(true);
          }
        }}
        text="Baixar ⬇️"
      />
    </BannerContainer>
  );
}
