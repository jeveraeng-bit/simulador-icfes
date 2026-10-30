import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Simulador ICFES — Saber 11 y Saber Pro | Por Juan Esteban Vera Rodríguez',
  description:
    'Plataforma psicométrica avanzada de simulación para pruebas de Estado Saber 11 y Saber Pro. Desarrollado por Juan Esteban Vera Rodríguez, estudiante de Ingeniería Electrónica en la Universidad Antonio Nariño sede Ibagué.',
  authors: [{ name: 'Juan Esteban Vera Rodríguez' }],
  creator: 'Juan Esteban Vera Rodríguez — Universidad Antonio Nariño (Sede Ibagué)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
