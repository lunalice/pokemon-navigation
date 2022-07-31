import Link from 'next/link';

export default function Header() {
  return (
    <>
      <header className="sticky top-0 px-3 py-1 border-b-4 border-black bg-[#cbccaaff] z-10">
        <div className="flex">
          <div className="flex-1">
            <Link href="/">
              <a>
                <h1 className="lg:text-2xl">
                  Pokemon Navigation
                </h1>
              </a>
            </Link>
          </div>
          <div className="flex-1 text-right"><p className="lg:text-2xl">Share on</p>
            <div className="share">
              <a href="https://twitter.com/share?text=Pokemon+navigation+%7C+%40yamashitaP21&amp;url=https://pokemon-navigation.vercel.app/" target="_blank" rel="noreferrer"><i className="nes-icon twitter"></i></a>
              <a href="https://github.com/lunalice/pokemon-navigation/" target="_blank" rel="noreferrer"><i className="nes-icon github"></i></a>
              <a href="https://forms.gle/9tTKqNvWz5rybrP2A" target="_blank" rel="noreferrer"><i className="nes-icon coin"></i></a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}