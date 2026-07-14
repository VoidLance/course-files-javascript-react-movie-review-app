import { useTheme } from '../context/ThemeContext';

export const useThemeClasses = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    isDark,
    pageGradient: isDark 
      ? 'bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d]'
      : 'bg-gradient-to-b from-[#8b7355] to-[#6b5644]',
    text: isDark ? 'text-amber-100' : 'text-amber-100',
  };
};
