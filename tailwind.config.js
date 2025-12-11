export default {
  important: true,
  prefix: "tw-",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["bg-lettersV4"],
  root: "__next",
  theme: {
    extend: {
      colors: {
        primary: "#607D8B",
        secondary: "#009688",
        periwinkle: "#BBD5FF",
        redribbon: "#ED0A34",
        mischka: "#E2E2EA",
        nobel: "#B7B7B7",
        ebony: "#11142D",
        "white-lilac": "#F7F7FC",
        "link-water": "#DBD7F4",
        "border-gradient": "var(--border-gradient)",
        "light-blue": "#CDEBF4",
        "light-green": "#019681",
        "dark-blue": "#7DB3C3",
        "lighter-blue": "#E6F6FB",
      },
      backgroundImage: {
        "mf-login-bg": "url('../public/images/login-bg.jpg')",
        gradient2: "linear-gradient(90deg, #E8BCE8, #C9F1F5)",
        "indicator-gradient": "linear-gradient(to bottom, #FFF1EB, #C7F4FE)",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite", // по умолчанию 1s
      },
    },
    container: {
      center: true,
      padding: "1rem",
    },
  },
  plugins: [],
};
