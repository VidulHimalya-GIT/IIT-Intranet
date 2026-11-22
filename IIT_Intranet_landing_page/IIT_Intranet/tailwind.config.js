// Same theme the login page used to pass to the Tailwind CDN script.
module.exports = {
  content: ["./iit_intranet_portal.html"],
  theme: {
    extend: {
      colors: {
        iitRed: '#C41230', iitRedHover: '#A30F27', iitGold: '#C5A059',
        iitDark: '#16181A', iitCardDark: '#1E2124',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
};
