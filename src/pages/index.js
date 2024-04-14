import Head from "next/head";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Widgets for helpchess.org</title>
        <meta name="description" content="Widgets for helpchess.org" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={inter.className}>
        <h1>Widgets for helpchess.org</h1>
      </main>
    </>
  );
}
