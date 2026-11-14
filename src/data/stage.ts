/**
 * The Stage - your dance career.
 *
 * PHOTOS live in src/assets/photos/stage/ (jpg, png, webp or avif).
 * - The home page shows the cards listed in `selected` below (photo + caption).
 * - /stage shows every photo in the folder, in filename order.
 * To replace a placeholder, overwrite the file with the same name.
 *
 * Anything with `placeholder: true` (or 20XX) still needs your input. `npm run todo` lists them.
 */

export const stageIntro = {
  kicker: "Off-screen, on stage - since 2019",
  title: "The Stage",
  lead: "Professional dancer with Dance Studio Aster Sarajevo: partner dancing and formation work, on TV, at brand events and in national and international competitions.",
  videoNote: "Performance videos are available on request.",
};

/**
 * Salsa is counted 1-2-3, pause, 5-6-7, pause. Each step carries one thing the stage taught me
 * that I use at work. Counts 4 and 8 are the pauses.
 */
export const lessons = [
  {
    count: 1,
    title: "Discipline",
    text: "The same eight counts, rehearsed until they are automatic. I bring that habit to code: test it, review it, and only then call it done.",
  },
  {
    count: 2,
    title: "Teamwork",
    text: "Partner dancing only works when two people move as one. I listen first, adapt, and leave my ego in the dressing room.",
  },
  {
    count: 3,
    title: "Leadership",
    text: "A good lead is a clear signal, never force. Leading workshops and trainings taught me to explain a step five ways until it clicks.",
  },
  {
    count: 5,
    title: "Consistency",
    text: "Competitions are won in the hundredth rehearsal, not the first. I show up and deliver, week after week, sprint after sprint.",
  },
  {
    count: 6,
    title: "Adaptability",
    text: "The music changes, the floor is slippery, a partner misses a step - you recover without stopping. Same with changing requirements and production bugs.",
  },
  {
    count: 7,
    title: "Composure",
    text: "Live TV gives you one take. That calm under the lights is what I bring to deadlines, launches and client demos.",
  },
];

export const pauses = {
  4: "Pause. In salsa, 4 is held - knowing when not to move is part of the rhythm.",
  8: "Pause. Hold the final picture, breathe, and go again from the top.",
};

/** Programme note under the dancers. <b> = highlighted. data-placeholder marks what you still need to fill in. */
export const programmeNote =
  "On stage since <b>2019</b>. <b>First place</b> at national and international competitions. Seen on <b>Supertalent</b>, on Bosnian national TV, at brand events such as <b>Mercedes-Benz</b>, and in <b>35+</b> other shows.";
/** The photo cards on the home page. 3 to 6 cards work best; 4 fills one row on desktop. */
export const selected = [
  {
    photo: "stage-01.jpg",
    title: "Supertalent",
    meta: "TV, 2021",
    alt: "Faris Karkelja performing on the Supertalent stage",
  },
  {
    photo: "stage-02.jpg",
    title: "Mercedes-Benz",
    meta: "Brand event, 2022",
    alt: "Performance at a Mercedes-Benz event",
  },
  {
    photo: "stage-03.webp",
    title: "Viennese Ball",
    meta: "Opening ceremony, Sarajevo City Hall",
    alt: "Faris Karkelja at the Viennese Ball",
  },
  {
    photo: "stage-04.jpg",
    title: "National Dance Competition",
    meta: "1st place, 2025",
    alt: "Faris Karkelja at the national dance competition",
  },
  {
    photo: "stage-05.JPG",
    title: "International Dance Competition",
    meta: "1st place, 2021",
    alt: "Faris Karkelja at the international dance competition",
  },
  {
    photo: "stage-06.jpg",
    title: "Let's Go For the Gold - Avon",
    meta: "Cosmetics show, 2023",
    alt: "Faris Karkelja at the Let's Go For the Gold - Avon event",
  },
];

export type Performance = {
  title: string;
  type:
    | "TV"
    | "Brand event"
    | "Competition"
    | "Live show"
    | "Festival"
    | "Workshop";
  detail: string;
  year: string;
  achievement?: string;
  placeholder?: boolean;
};

/** The full list on /stage. Add as many as you like. */
export const performances: Performance[] = [
  // 2025
  {
    title: "Latiness by Martina",
    type: "Workshop",
    detail: "Salsa workshops, choreography and show, Posušje",
    year: "2025",
  },
  {
    title: "European Heritage Days",
    type: "Live show",
    detail: "Dance show, Sarajevo",
    year: "2025",
  },

  // 2024
  {
    title: "Viennese Ball",
    type: "Live show",
    detail: "Opening of the gala evening, Sarajevo",
    year: "2024",
  },
  {
    title: "Paths Towards Peace",
    type: "Festival",
    detail: "HeARTmony project final event, Loppiano, Italy",
    year: "2024",
  },
  {
    title: "Sarajevo Salsa Congress",
    type: "Festival",
    detail:
      "Choreography performed with international professional dancers, Sarajevo",
    year: "2024",
  },
  {
    title: "Masquerade Dance Performance",
    type: "Live show",
    detail: "Themed dance show, Sarajevo",
    year: "2024",
  },
  {
    title: "High School Performance",
    type: "Live show",
    detail: "Dance performance at a school event, Sarajevo",
    year: "2024",
  },

  // 2023
  {
    title: "Let's Go For the Gold - Avon",
    type: "Brand event",
    detail: "Cosmetics show, Sarajevo",
    year: "2023",
  },
  {
    title: "Shinefinity - Wella Professionals",
    type: "Brand event",
    detail: "Beauty and fashion show, Sarajevo",
    year: "2023",
  },
  {
    title: "International Dance Day",
    type: "TV",
    detail: "Nova BH, Sarajevo",
    year: "2023",
  },
  {
    title: "High School Performance",
    type: "Live show",
    detail: "Dance performance at a school event, Sarajevo",
    year: "2023",
  },

  // 2022
  {
    title: "Mercedes-Benz STARline",
    type: "Brand event",
    detail: "Car show, Sarajevo",
    year: "2022",
  },
  {
    title: "JUMBO Anniversary Celebration",
    type: "Brand event",
    detail: "Dance show for the company's anniversary, Sarajevo",
    year: "2022",
  },
  {
    title: "Armonia fra i Popoli",
    type: "Festival",
    detail: "HeARTmony project dance performance, Montecatini Terme, Italy",
    year: "2022",
  },
  {
    title: "Sarajevo Salsa Congress",
    type: "Festival",
    detail: "Formation show at the international congress, Sarajevo",
    year: "2022",
  },
  {
    title: "25th BaSS Congress",
    type: "Festival",
    detail: "Congress performance, Sarajevo",
    year: "2022",
  },
  {
    title: "Welcome To The Future",
    type: "Live show",
    detail: "Dance show, Sarajevo",
    year: "2022",
  },
  {
    title: "Ladies & Gentlemen",
    type: "Brand event",
    detail: "Fashion show, Sarajevo",
    year: "2022",
  },
  {
    title: "PMU Balkan GOLD Congress",
    type: "Brand event",
    detail: "Beauty and fashion show, Sarajevo",
    year: "2022",
  },
  {
    title: "Dance Performance",
    type: "TV",
    detail: "Nova BH, Sarajevo",
    year: "2022",
  },
  {
    title: "Choreographic Showcase",
    type: "TV",
    detail: "O Kanal, Sarajevo",
    year: "2022",
  },
  {
    title: "Dance Feature",
    type: "TV",
    detail: "TVSA, Sarajevo",
    year: "2022",
  },

  // 2021
  {
    title: "Supertalent",
    type: "TV",
    detail: "Nova TV, Zagreb - national talent show in Croatia",
    year: "2021",
  },
  {
    title: "New Year's Eve Celebration",
    type: "TV",
    detail: "Hayat TV, Sarajevo",
    year: "2021",
  },
  {
    title: "Sarajevo Salsa Congress",
    type: "Festival",
    detail: "Formation show at the international congress, Sarajevo",
    year: "2021",
  },
  {
    title: "Bosniak Institute Fashion Show",
    type: "Live show",
    detail: "Dance performance at a fashion show, Sarajevo",
    year: "2021",
  },
  {
    title: "Time Of My Life",
    type: "Live show",
    detail: "Dance improvisation performance, Sarajevo",
    year: "2021",
  },
  {
    title: "Wedding First Dance Surprise",
    type: "Live show",
    detail: "A surprise choreography for the bride and groom, Sarajevo",
    year: "2021",
  },

  // 2020
  {
    title: "Dejana Talk Show",
    type: "TV",
    detail: "OBN, Sarajevo",
    year: "2020",
  },
];

/** Dance awards shown on /stage. */
export const stageAwards = [
  {
    name: "1st Place, Salsa Couples - National Championship of BiH",
    org: "Modern Dance Association of BiH, Zenica",
    year: "2025",
  },
  {
    name: "Plaque for Outstanding Contribution - European Heritage Days 2024",
    org: "Federal Ministry of Culture and Sports",
    year: "2024",
  },
  {
    name: "1st Place, Salsa Duo - Mo-Stars Mediteran Open Dance (international)",
    org: "Dance Studio Mo Stars, Mostar",
    year: "2023",
  },
  {
    name: "1st Place, Salsa Couples - Inter Dance Fest (international)",
    org: "Orion Dance Studio and Modern Dance Association of BiH, Sarajevo",
    year: "2023",
  },
  {
    name: "1st Place, Salsa Couples - International Dance Development Centre Festival",
    org: "Modern Dance Association of BiH, Sarajevo",
    year: "2023",
  },
  {
    name: "1st Place, Salsa Groups - Inter Dance Fest (international)",
    org: "Orion Dance Studio and Modern Dance Association of BiH, Sarajevo",
    year: "2022",
  },
  {
    name: "1st Place, Salsa Couples - National Championship of BiH",
    org: "Modern Dance Association of BiH and Dance Club Gema, Banja Luka",
    year: "2022",
  },
  {
    name: "1st Place, Salsa Groups - National Championship of BiH",
    org: "Modern Dance Association of BiH and Dance Club Gema, Banja Luka",
    year: "2022",
  },
  {
    name: "1st Place, Salsa Couples - Banja Luka Dance Fest (international)",
    org: "Dance Club Gemma and Modern Dance Association of BiH, Banja Luka",
    year: "2021",
  },
  {
    name: "1st Place, Salsa Groups - Banja Luka Dance Fest (international)",
    org: "Dance Club Gemma and Modern Dance Association of BiH, Banja Luka",
    year: "2021",
  },
  {
    name: "1st Place, Salsa Couples - National Championship of BiH",
    org: "Orion Dance Studio and Modern Dance Association of BiH, Pale",
    year: "2021",
  },
];

/** Optional captions for the gallery on /stage, keyed by filename. */
export const photoCaptions: Record<string, { caption: string; alt: string }> = {
  "stage-07.jpg": {
    caption: "National Dance Competition, 1st place, 2021",
    alt: "Faris Karkelja and his partner at the national salsa championship",
  },
  "stage-08.jpg": {
    caption: "Armonia fra i Popoli, Montecatini Terme, Italy, 2022",
    alt: "Dance performance at Armonia fra i Popoli in Montecatini Terme",
  },
  "stage-09.jpg": {
    caption: "Paths Towards Peace, Loppiano, Italy, 2024",
    alt: "Dance performance at the Paths Towards Peace event in Loppiano",
  },
};
