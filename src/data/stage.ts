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
  'On stage since <b>2019</b>. <b>First place</b> at national and international competitions. Performances on <b>Supertalent</b> and live TV, at brand events such as <b>Mercedes-Benz</b>, and <b data-placeholder="true">00+</b> shows in total.';

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
];

export type Performance = {
  title: string;
  type: "TV" | "Brand event" | "Competition" | "Live show" | "Festival";
  detail: string;
  year: string;
  achievement?: string;
  placeholder?: boolean;
};

/** The full list on /stage. Add as many as you like. */
export const performances: Performance[] = [
  {
    title: "Supertalent",
    type: "TV",
    detail: "Fill in show and season",
    year: "20XX",
    placeholder: true,
  },
  {
    title: "Mercedes-Benz",
    type: "Brand event",
    detail: "Fill in event name and city",
    year: "20XX",
    placeholder: true,
  },
  {
    title: "National Dance Competition",
    type: "Competition",
    detail: "Modern Dance Association of BiH",
    year: "2021-2023, 2025",
    achievement: "1st place",
  },
  {
    title: "International Dance Competition",
    type: "Competition",
    detail: "Fill in competition name and city",
    year: "20XX",
    achievement: "1st place",
    placeholder: true,
  },
  {
    title: "Performance title",
    type: "Live show",
    detail: "Fill in venue or event",
    year: "20XX",
    placeholder: true,
  },
  {
    title: "Performance title",
    type: "TV",
    detail: "Fill in broadcaster or show",
    year: "20XX",
    placeholder: true,
  },
  {
    title: "Performance title",
    type: "Festival",
    detail: "Fill in festival and city",
    year: "20XX",
    placeholder: true,
  },
  {
    title: "Performance title",
    type: "Brand event",
    detail: "Fill in brand and event",
    year: "20XX",
    placeholder: true,
  },
];

/** Dance awards shown on /stage. */
export const stageAwards = [
  {
    name: "1st Place, National Dance Competition",
    org: "Modern Dance Association of BiH",
    year: "2021-2023, 2025",
  },
  {
    name: "1st Place, International Dance Competition",
    org: "Fill in the competition",
    year: "20XX",
    placeholder: true,
  },
];

/** What the stage adds to the day job - shown on /stage. */
export const offStage = [
  "Partner and formation dancing since 2019 with Dance Studio Aster Sarajevo.",
  "Led workshops and trainings for other dancers.",
  "TV and live performances in front of large audiences.",
];

/** Optional captions for the gallery on /stage, keyed by filename. */
export const photoCaptions: Record<string, { caption: string; alt: string }> = {
  "stage-05.jpg": {
    caption: "Caption for photo 05",
    alt: "Faris Karkelja performing on stage",
  },
  "stage-06.jpg": {
    caption: "Caption for photo 06",
    alt: "Dance performance under stage lights",
  },
};
