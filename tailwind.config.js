module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#121212',
          light: '#303030',
        },
        foreground: '#efefef',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
