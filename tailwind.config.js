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
        portal: {
          blue: '#00adef',
          orange: '#ff6a00',
        },
        foreground: '#efefef',
      },
      animation: {
        toast: 'toast 0.5s ease-in-out',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
