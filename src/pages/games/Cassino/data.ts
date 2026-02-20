import type { CasinoGame } from "./types";
import { casinoGameImages, tigreGameImages } from "./images";

export const casinoGames: CasinoGame[] = [
    { id: 1, type: "Slots", image: casinoGameImages.game1, href: "/games/slots" },
    { id: 2, type: "Slots", image: casinoGameImages.game2, href: "/games/slots" },
    { id: 3, type: "Slots", image: casinoGameImages.game3, href: "/games/slots" },
    { id: 4, type: "Slots", image: casinoGameImages.game4, href: "/games/slots" },
    { id: 5, type: "Arcade", image: casinoGameImages.game5, href: "/games/crash" },
    { id: 6, type: "Slots", image: casinoGameImages.game6, href: "/games/slots" },
    { id: 7, type: "Slots", image: casinoGameImages.game7, href: "/games/slots" },
    { id: 8, type: "Slots", image: casinoGameImages.game8, href: "/games/slots" },
    { id: 9, type: "Slots", image: casinoGameImages.game9, href: "/games/slots" },
    { id: 10, type: "Slots", image: casinoGameImages.game10, href: "/games/slots" },
    { id: 11, type: "Mesa e Cartas", image: casinoGameImages.game11, href: "/games/blackjack" },
    { id: 12, type: "Slots", image: casinoGameImages.game12, href: "/games/slots" },
];

export const tigreGames: CasinoGame[] = [
    { id: 1, type: "Slots", image: tigreGameImages.tigre1, href: "/games/slots" },
    { id: 2, type: "Slots", image: tigreGameImages.tigre2, href: "/games/slots" },
    { id: 3, type: "Slots", image: tigreGameImages.tigre3, href: "/games/slots" },
    { id: 4, type: "Slots", image: tigreGameImages.tigre4, href: "/games/slots" },
    { id: 5, type: "Arcade", image: tigreGameImages.tigre5, href: "/games/crash" },
    { id: 6, type: "Slots", image: tigreGameImages.tigre6, href: "/games/slots" },
];

