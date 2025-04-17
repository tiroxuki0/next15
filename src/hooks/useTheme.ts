'use client'

import { useTheme as useNextTheme } from 'next-themes'

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const currentTheme = theme === 'system' ? systemTheme : theme

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    isDark: currentTheme === 'dark'
  }
}

/* EXAMPLE */

/* 

import { useTheme } from '@/hooks/useTheme';

function ThemeSwitcher() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full bg-primary text-white"
    >
      {isDark ? 'Chế độ sáng' : 'Chế độ tối'}
    </button>
  );
}

*/
