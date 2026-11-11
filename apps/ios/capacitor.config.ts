import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ua.marshgo.app',
  appName: 'MARSHGO',
  webDir: 'web/dist',
  ios: { contentInset: 'never', preferredContentMode: 'mobile' },
  plugins: { StatusBar: { overlaysWebView: true, style: 'DARK' } },
};

export default config;
