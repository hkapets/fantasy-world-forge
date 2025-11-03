declare global {
  interface Window {
    __TAURI__?: any;
    electron?: any;
  }
}

export type Platform = 'web' | 'electron' | 'tauri';

export const platformDetection = {
  isDesktop(): boolean {
    return this.isElectron() || this.isTauri();
  },

  isElectron(): boolean {
    return (window as any).electron !== undefined;
  },

  isTauri(): boolean {
    return (window as any).__TAURI__ !== undefined;
  },

  isWeb(): boolean {
    return !this.isDesktop();
  },

  getPlatform(): Platform {
    if (this.isElectron()) return 'electron';
    if (this.isTauri()) return 'tauri';
    return 'web';
  },

  getPlatformInfo() {
    const platform = this.getPlatform();
    return {
      platform,
      isDesktop: this.isDesktop(),
      isWeb: this.isWeb(),
      userAgent: navigator.userAgent,
    };
  },
};

export const useDesktopCapabilities = () => {
  const platform = platformDetection.getPlatform();

  return {
    platform,
    canAccessFileSystem: platformDetection.isDesktop(),
    canAccessClipboard: true,
    canUseNativeMenus: platformDetection.isDesktop(),
    canUseSystemTray: platformDetection.isDesktop(),
    canUseAutoUpdate: platformDetection.isDesktop(),
    hasElectronAPI: platformDetection.isElectron(),
    hasTauriAPI: platformDetection.isTauri(),
  };
};
