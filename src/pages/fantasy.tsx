import Head from 'next/head';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FilteredMoviePage from '../components/FilteredMoviePage';
import { GENRE_TO_TMDB_IDS } from '../types/movie';

export default function FantasyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <Head>
        <title>Fantasy Movies</title>
        <meta name="description" content="Fantasy movies" />
      </Head>
      <Header />
      <main className={`flex min-h-screen flex-col items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d]' 
          : 'bg-gradient-to-b from-[#8b7355] to-[#6b5644]'
      }`}>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <FilteredMoviePage
            title="Fantasy Movies"
            apiType="by_genre"
            genreIds={GENRE_TO_TMDB_IDS.fantasy}
            emptyMessage="No fantasy movies found."
            showGenreFilter={true}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
