import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Bolivia Insight · Admin',
  description: 'Panel administrativo — meetings agendados',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        {/* Google Identity Services — for admin Google login */}
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}
