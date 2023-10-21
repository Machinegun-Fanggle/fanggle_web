import theme from './config/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '.storybook/*.{ts,js}',
  ],
  theme: {
    colors: theme.colors,
    extend: theme,
  },
  plugins: [],
};
