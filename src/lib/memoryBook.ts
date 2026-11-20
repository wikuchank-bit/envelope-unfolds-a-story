import p1 from "@/assets/book-memory-1.png.asset.json";
import p2 from "@/assets/book-memory-2.png.asset.json";
import p3 from "@/assets/book-memory-3.png.asset.json";
import p4 from "@/assets/book-memory-4.png.asset.json";
import p5 from "@/assets/book-memory-5.jpg.asset.json";
import p6 from "@/assets/book-memory-6.jpg.asset.json";
import p7 from "@/assets/book-memory-7.jpg.asset.json";
import p8 from "@/assets/book-memory-8.jpg.asset.json";
import p9 from "@/assets/book-memory-9.jpg.asset.json";
import p10 from "@/assets/book-memory-10.jpg.asset.json";
import p11 from "@/assets/book-memory-11.png.asset.json";

export const BOOK_PAGES = [
  { note: "A little collection of moments that mean everything to me.", photos: [p1.url, p10.url] },
  { note: "Even the simplest moments become special when I'm with you.", photos: [p2.url, p3.url] },
  { note: "From playing games together to making memories, every little moment with you is worth keeping.", photos: [p4.url, p5.url] },
  { note: "I wish we could turn every moment together into a memory we could hold forever.", photos: [p6.url, p11.url] },
  { note: "Distance may keep us apart, but these little moments always bring me closer to you.", photos: [p7.url] },
  { note: "If I could relive one thing, it would be all these little moments with you.", photos: [p8.url, p9.url] },
  { note: "These are just little pieces of our story, but every single one of them means so much to me. And I hope we get to fill many more pages together.", photos: [] },
];

export const FIREWORK_TIMES = [1200, 4200, 7400] as const;
export function fireworksAt(elapsed: number) {
  return FIREWORK_TIMES.filter((time) => elapsed >= time).length;
}
export const LOVE_LETTERS = [{
  id: "choosing-us",
  title: "A Promise to Keep Choosing Each Other",
  text: `Aku sangat berharap kamu selalu mempertimbangkan hal-hal yang bisa menyakitiku di kemudian hari, karena aku pun selalu berusaha melakukan hal yang sama untukmu. Aku sungguh mencintaimu, dan menyakitimu bukanlah tujuanku.

Aku sangat ingin kita bisa terus bersama, selamanya saling memperbaiki diri dan menjadi lebih baik untuk satu sama lain, tanpa kecurangan, kebohongan, ataupun hal-hal yang bisa saling menyakiti.

Aku sungguh mencintaimu, and I truly mean it. Selama kamu mau berusaha dan tidak pernah menyerah padaku, aku pun akan melakukan hal yang sama untukmu. Namun, bukan berarti kita harus menerima hal-hal yang seharusnya tidak dilakukan dan yang bisa sangat menyakitkan.

Happy 1st Anniversary, sayang. Kita berdua sudah sangat hebat karena berhasil bertahan dan sampai sejauh ini bersama.`,
}];