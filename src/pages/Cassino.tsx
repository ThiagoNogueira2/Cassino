import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import game1 from "@/images/game1.avif";
import game2 from "@/images/game2.avif";
import game3 from "@/images/game3.avif";
import game4 from "@/images/game4.avif";
import game5 from "@/images/game5.svg";
import game6 from "@/images/game6.avif";
import game7 from "@/images/game7.avif";
import game8 from "@/images/game8.avif";
import game9 from "@/images/game9.avif";
import game10 from "@/images/game10.avif";
import game11 from "@/images/game11.avif";
import game12 from "@/images/game12.avif";

import tigre1 from "@/images/tigre1.svg";
import tigre2 from "@/images/tigre2.avif";
import tigre3 from "@/images/tigre3.avif";
import tigre4 from "@/images/tigre4.avif";
import tigre5 from "@/images/tigre5.svg";
import tigre6 from "@/images/tigre6.avif";

type CasinoGame = {
    id: number;
    type: "Slots" | "Arcade" | "Mesa e Cartas";
    image: string;
    href: string;
};

const casinoGames: CasinoGame[] = [
    { id: 1, type: "Slots", image: game1, href: "/games/slots" },
    { id: 2, type: "Slots", image: game2, href: "/games/slots" },
    { id: 3, type: "Slots", image: game3, href: "/games/slots" },
    { id: 4, type: "Slots", image: game4, href: "/games/slots" },
    { id: 5, type: "Arcade", image: game5, href: "/games/crash" },
    { id: 6, type: "Slots", image: game6, href: "/games/slots" },
    { id: 7, type: "Slots", image: game7, href: "/games/slots" },
    { id: 8, type: "Slots", image: game8, href: "/games/slots" },
    { id: 9, type: "Slots", image: game9, href: "/games/slots" },
    { id: 10, type: "Slots", image: game10, href: "/games/slots" },
    { id: 11, type: "Mesa e Cartas", image: game11, href: "/games/blackjack" },
    { id: 12, type: "Slots", image: game12, href: "/games/slots" },
];

const tigreGames: CasinoGame[] = [
    { id: 1, type: "Slots", image: tigre1, href: "/games/slots" },
    { id: 2, type: "Slots", image: tigre2, href: "/games/slots" },
    { id: 3, type: "Slots", image: tigre3, href: "/games/slots" },
    { id: 4, type: "Slots", image: tigre4, href: "/games/slots" },
    { id: 5, type: "Arcade", image: tigre5, href: "/games/crash" },
    { id: 6, type: "Slots", image: tigre6, href: "/games/slots" },
];

export default function CassinoPage() {
    return (
        <div className="min-h-screen bg-[#071423] text-white">
            <header className="sticky top-0 z-40 border-b border-[#1e3149] bg-[#08192b]/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 md:px-6">
                    <Link to="/" className="text-3xl font-black leading-none text-white">
                        NeonBet
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link to="/deposit">
                            <Button className="border-0 bg-[#f02254] text-sm font-black uppercase hover:bg-[#ff2a60]">
                                Depositar
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6">
                <section className="p-4 md:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <h1 className="text-3xl font-black uppercase tracking-wide">Jogos de Cassino</h1>
                        <Link to="/">
                            <Button className="border border-[#2a3e58] bg-transparent text-xs font-black uppercase hover:bg-[#15263b]">
                                Voltar
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {casinoGames.map((game) => (
                            <Link
                                key={game.id}
                                to={game.href}
                                className="group block overflow-hidden rounded-md"
                            >
                                <div className="relative h-[190px]">
                                    <img
                                        src={game.image}
                                        alt={`Jogo ${game.id}`}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                    <span className="absolute left-2 top-2 rounded bg-[#12e7b2] px-1.5 py-0.5 text-[10px] font-black uppercase text-[#00191d]">
                                        {game.type}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h2 className="mb-5 text-3xl font-black uppercase tracking-wide">Jogos do Tigre</h2>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            {tigreGames.map((game) => (
                                <Link
                                    key={`tigre-${game.id}`}
                                    to={game.href}
                                    className="group block overflow-hidden rounded-md"
                                >
                                    <div className="relative h-[190px]">
                                        <img
                                            src={game.image}
                                            alt={`Jogo do Tigre ${game.id}`}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                        <span className="absolute left-2 top-2 rounded bg-[#12e7b2] px-1.5 py-0.5 text-[10px] font-black uppercase text-[#00191d]">
                                            {game.type}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

