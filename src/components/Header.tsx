import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <div className={`flex items-center justify-center relative px-4 ${isDark ? 'bg-[#1a1a1a]' : ''}`}>
        <h1 className={`text-center text-3xl p-3 rounded-xl local-font ${isDark ? 'bg-[#2d2d2d] text-amber-100' : 'bg-[#3a3a3a] text-amber-100'}`}>Movie Review</h1>
        <button
          onClick={toggleTheme}
          className={`absolute right-4 px-4 py-2 rounded-lg font-semibold transition-colors ${
            isDark
              ? 'bg-amber-100 text-[#2d2d2d] hover:bg-amber-200'
              : 'bg-rose-400 text-[#2d2d2d] hover:bg-rose-300'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      <nav className={`${isDark ? 'bg-[#2d2d2d] text-amber-100' : 'bg-taupe-500 text-mist-700'} items-center justify-center m-1 flex text-center rounded-lg p-2`}>
        <ul className="m-2 p-2 flex flex-wrap justify-center">
          <li>
            <Link href="/most-popular" className={`rounded-lg border border-3 border-rose-400 m-2 p-2 ${isDark ? 'bg-[#3a3a3a] text-amber-100' : 'bg-amber-100 text-[#2d2d2d]'}`}>Most Popular Movies</Link>
          </li>
          <li>
            <Link href="/highly-rated" className={`rounded-lg border-3 border-rose-400 p-2 m-2 ${isDark ? 'bg-[#3a3a3a] text-amber-100' : 'bg-amber-100 text-[#2d2d2d]'}`}>Highly Rated</Link>
          </li>
          <li>
            <Link href="/action" className={`rounded-lg border-3 border-rose-400 p-2 m-2 ${isDark ? 'bg-[#3a3a3a] text-amber-100' : 'bg-amber-100 text-[#2d2d2d]'}`}>Action</Link>
          </li>
          <li>
            <Link href="/fantasy" className={`rounded-lg border-3 border-rose-400 p-2 m-2 ${isDark ? 'bg-[#3a3a3a] text-amber-100' : 'bg-amber-100 text-[#2d2d2d]'}`}>Fantasy</Link>
          </li>
          <li>
            <Link href="/romance" className={`rounded-lg border-3 border-rose-400 p-2 m-2 ${isDark ? 'bg-[#3a3a3a] text-amber-100' : 'bg-amber-100 text-[#2d2d2d]'}`}>Romance</Link>
          </li>
          <li>
            <Link href="/comedy" className={`rounded-lg border-3 border-rose-400 p-2 m-2 ${isDark ? 'bg-[#3a3a3a] text-amber-100' : 'bg-amber-100 text-[#2d2d2d]'}`}>Comedy</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header
