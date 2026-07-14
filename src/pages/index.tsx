import Head from 'next/head';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MostPopularPageContent from '../components/MostPopularPageContent';

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <Head>
        <title>Most Popular Movies</title>
        <meta name="description" content="Most popular movies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={`flex min-h-screen flex-col items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d]' 
          : 'bg-gradient-to-b from-[#8b7355] to-[#6b5644]'
      }`}>
        <MostPopularPageContent />
      </main>
      <Footer />
    </>
  );
}
