import Link from 'next/link';

export default function TurnButton({ id, pokemonIds }: any) {
  const prevId = Number(id) - 1;
  const nextId = Number(id) + 1;
  const isPrev = pokemonIds.includes(prevId);
  const isNext = pokemonIds.includes(nextId);
  return (
    <>
        {
            isPrev && (
                <Link href={{ pathname: '/pokemon/[id]', query: { id: prevId }}} passHref>
                    <a>
                        <button className="nes-btn fixed top-[50%] left-4">{`<`}</button>
                    </a>
                </Link>
            )
        }
        {
            isNext && (
                <Link href={{ pathname: '/pokemon/[id]', query: { id: nextId }}} passHref>
                    <a>
                        <button className="nes-btn fixed top-[50%] right-4">{`>`}</button>
                    </a>
                </Link>
            )
        }
    </>
  );
}