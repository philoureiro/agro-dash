import { useEffect, useState } from "react"

export function usePWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<unknown>(null)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)

  useEffect(() => {
    // Para saber se já está rodando como PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // Para iOS
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true

    setIsInstalled(isStandalone)

    // Captura o evento que permite mostrar o prompt para instalar
    const handler = (e: Event) => {
      if ("preventDefault" in e && typeof e.preventDefault === "function") {
        e.preventDefault()
      }
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Detecta instalação (Android/Chrome)
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  return { deferredPrompt, isInstalled }
}
