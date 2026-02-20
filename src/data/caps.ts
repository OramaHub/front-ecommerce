import cap1 from "../assets/1.png";
import cap2 from "../assets/2.png";
import cap3 from "../assets/3.png";
import cap4 from "../assets/4.png";
import cap6 from "../assets/6.png";
import type { Cap } from "../types/cap";

export const caps: Cap[] = [
  {
    id: 1,
    src: cap1,
    label: "Modelo 1",
    tagline: "Natureza, conforto e muito estilo.",
    description: "Este modelo une tons terrosos que remetem à natureza e ao conforto. É a escolha ideal para aquele café descontraído ou um passeio ao ar livre no fim de tarde. Um toque de sobriedade que nunca sai de moda.",
    productId: 1,
  },
  {
    id: 2,
    src: cap2,
    label: "Modelo 2",
    tagline: "Tão à vontade no mar quanto no asfalto.",
    description: "Com uma pegada clássica e sofisticada, este modelo transita entre o deck de um barco e a correria da cidade com a mesma naturalidade. O azul marinho traz a autoridade, enquanto o branco garante o frescor.",
    productId: 2,
  },
  {
    id: 3,
    src: cap3,
    label: "Modelo 3",
    tagline: "Branco que não precisa se explicar.",
    description: "Este é o modelo para quem não precisa de cores para se destacar. Perfeito para dias de sol intenso ou para iluminar um look monocromático. Leveza absoluta para quem vive intensamente o verão.",
    productId: 3,
  },
  {
    id: 4,
    src: cap4,
    label: "Modelo 4",
    tagline: "A cidade também é selvagem.",
    description: "Com uma estética militar urbana, este boné foi feito para quem tem o pé na estrada e a mente na aventura. Resistente no visual e impecável no estilo, ele é o parceiro certo para trilhas ou para o concreto da metrópole.",
    productId: 4,
  },
  {
    id: 6,
    src: cap6,
    label: "Modelo 6",
    tagline: "O coringa que nunca fica em casa.",
    description: "A base clara traz leveza, enquanto a aba preta entrega a atitude necessária para qualquer rolê noturno. Se você busca uma peça coringa que combina com todo o seu guarda-roupa, acabou de encontrar.",
    productId: 6,
  },
];
