import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} app-root`}>
      <Component {...pageProps} />
    </div>
  );
}
