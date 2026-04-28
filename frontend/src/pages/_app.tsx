import type { AppProps } from 'next/app';
import { JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={jetbrainsMono.className}>
      <Component {...pageProps} />
    </div>
  );
}
