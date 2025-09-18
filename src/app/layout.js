import { Rubik, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { UserProvider } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientLayout from '@/components/ClientLayout';
import 'antd/dist/reset.css';
import { CartProvider } from '@/context/CartContext';

export const metadata = { title: "PayNXT360", description: "Global Fintech Market Research Reports, Industry Statistics, Analysis PayNXT360" };

const rubikSans = Rubik({
  variable: '--font-rubik-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400','500','600','700','800','900'],
  display: 'swap',
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${rubikSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
        <CartProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <UserProvider>
              <Navbar />
              <ClientLayout>{children}</ClientLayout>
              <Footer />
            </UserProvider>
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}