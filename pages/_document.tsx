import Document, { Html, Head, Main, NextScript } from 'next/document';
import { GoogleAnalytics } from '../lib/gtag'
import Header from '../components/Header';
import Footer from '../components/Footer';

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