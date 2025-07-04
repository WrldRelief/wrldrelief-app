/** @type {import('tailwindcss').Config} */
import { uiKitPlugin } from '@worldcoin/mini-apps-ui-kit-react/src/tailwind';

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@worldcoin/mini-apps-ui-kit-react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [uiKitPlugin],
};

export default config;
