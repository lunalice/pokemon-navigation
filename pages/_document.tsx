import Document, { Html, Head, Main, NextScript } from 'next/document';
import { GoogleAnalytics } from '../lib/gtag'
import Header from '../components/Header';
import Footer from '../components/Footer';
const baseUrl: string | undefined = {
  production: "https://pokemon-navigation.vercel.app",
  development: "http://localhost:3001",
  test: "http://localhost:3001",
}[process.env.NODE_ENV];

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {

    return (
      <Html lang="ja">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:url" content={baseUrl} />
          <meta property="og:title" content="Pokemon Navigation" />
          <meta property="og:site_name" content="Pokemon Navigation" />
          <meta property="og:description" content="This site is a site where you can search by Pokemon name." />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={`${baseUrl}/ogp.png`} />
          <link href="https://unpkg.com/nes.css@2.3.0/css/nes.min.css" rel="stylesheet" />
          <GoogleAnalytics />
        </Head>
        <body>
          <Header />
          <Main />
          <Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;