import type { Clip, Scene, VibeMode, VibeSetting } from '@/lib/types';

export const VIBE_OPTIONS: { id: VibeSetting; label: string; badge: string; desc: string }[] = [
  { id: 'auto', label: 'Match Topic', badge: '✨ Auto (Match Topic)', desc: 'Automatically matches the video & hook style to each lesson’s topic' },
  { id: 'makeup', label: 'Makeup GRWM', badge: '💄 Makeup GRWM', desc: 'Get-Ready-With-Me vlog aesthetic & storytime hook' },
  { id: 'sport', label: 'Sport Focus', badge: '🏋️ Sport Focus', desc: 'High-energy athlete & workout hook' },
  { id: 'podcast', label: 'Podcast / Vlog', badge: '🎙️ Podcast / Vlog', desc: 'Late-night podcast & creator vlog hook' },
  { id: 'stickman', label: 'Stickman', badge: '✏️ Stickman', desc: 'Punchy hook + talking stickman chalkboard explainer' },
];

export const VIBES = VIBE_OPTIONS.filter((v): v is { id: VibeMode; label: string; badge: string; desc: string } => v.id !== 'auto');

/** Maps each subject / topic to its matching video style & hook format. */
export const SUBJECT_VIBE: Record<string, VibeMode> = {
  // Video vibe topics
  'Makeup & Beauty': 'makeup',
  'Sport & Fitness': 'sport',
  'Politics & Society': 'podcast',
  // Classic subjects mapped to their best-fitting video aesthetic
  Chemistry: 'makeup',
  Biology: 'makeup',
  Physics: 'sport',
  Geography: 'sport',
  History: 'podcast',
  Economics: 'podcast',
  English: 'podcast',
  Math: 'stickman',
  'Computer Science': 'stickman',
};

export const SUBJECT_META: Record<string, { icon: string; vibeLabel: string }> = {
  'Makeup & Beauty': { icon: '💄', vibeLabel: 'GRWM Vlog' },
  'Sport & Fitness': { icon: '🏋️', vibeLabel: 'Sport Focus' },
  'Politics & Society': { icon: '🎙️', vibeLabel: 'Podcast' },
  Chemistry: { icon: '🧪', vibeLabel: 'GRWM Lab' },
  Biology: { icon: '🧬', vibeLabel: 'GRWM Bio' },
  Physics: { icon: '⚡', vibeLabel: 'Sport Physics' },
  Geography: { icon: '🌍', vibeLabel: 'Action Geo' },
  History: { icon: '🏛️', vibeLabel: 'Story Pod' },
  Economics: { icon: '📈', vibeLabel: 'Money Pod' },
  English: { icon: '💬', vibeLabel: 'Creator Vlog' },
  Math: { icon: '📐', vibeLabel: 'Stickman' },
  'Computer Science': { icon: '💻', vibeLabel: 'Stickman' },
};

export function resolveVibeForClip(clip: Clip, setting: VibeSetting): VibeMode {
  if (setting !== 'auto') return setting;
  return SUBJECT_VIBE[clip.subject] ?? 'stickman';
}

type HookMap = Record<string, Record<VibeMode, { say: string; headline: string }>>;

export const CLIP_HOOKS: HookMap = {
  pythagoras: {
    stickman: {
      say: 'Why walk around the block when a 2,500-year-old shortcut saves your legs every single day?',
      headline: 'The 2,500-Year-Old Shortcut',
    },
    makeup: {
      say: 'Okay wait, while I blend this contour—let me show you the triangle trick that literally fixes every angle.',
      headline: 'GRWM · The Angle Trick',
    },
    sport: {
      say: 'Ever wonder how NFL defenders cut across the field to catch a faster runner? Pure geometry.',
      headline: 'The Defender’s Pursuit Angle',
    },
    podcast: {
      say: 'Imagine discovering one equation that every architect and game engine still uses daily.',
      headline: 'Ep. 01 · The Secret Geometry',
    },
  },
  photosynthesis: {
    stickman: {
      say: 'Plants literally eat sunlight and thin air for breakfast. Here is how they pull it off.',
      headline: 'Eating Pure Sunlight',
    },
    makeup: {
      say: 'Quick skincare pause—if you want to know what real glow looks like, plants turn literal sunlight into energy.',
      headline: 'GRWM · Ultimate Solar Glow',
    },
    sport: {
      say: 'Every breath of oxygen you take mid-sprint comes from this exact 60-second chemical reaction.',
      headline: 'Where Your Sprint Oxygen Comes From',
    },
    podcast: {
      say: 'Think about it: without one green molecule inside leaves, Earth would have zero breathable air.',
      headline: 'Ep. 02 · The Oxygen Engine',
    },
  },
  revolution: {
    stickman: {
      say: 'Imagine bread getting so expensive that an entire country deletes its monarchy.',
      headline: 'When Bread Toppled a King',
    },
    makeup: {
      say: 'Storytime while I set my powder: in 1789 the royals flexed so hard at Versailles that Paris completely snapped.',
      headline: 'GRWM · Royal Drama 1789',
    },
    sport: {
      say: 'The biggest comeback upset in political history started on 14 July 1789 in the streets of Paris.',
      headline: 'The Ultimate Upset of 1789',
    },
    podcast: {
      say: 'How does a society go from royal palaces to a republic and Napoleon in just ten years?',
      headline: 'Ep. 03 · Ten Years That Shook Europe',
    },
  },
  newton: {
    stickman: {
      say: 'Why is kicking a bowling ball way worse than kicking a football? Blame Isaac Newton.',
      headline: 'Why Bowling Balls Hurt',
    },
    makeup: {
      say: 'Hold on, before we do lashes—here is why heavy things take so much extra energy to move.',
      headline: 'GRWM · Effort vs. Momentum',
    },
    sport: {
      say: 'Every heavy bench press and explosive sprint boils down to one three-letter formula.',
      headline: 'The Physics of Explosive Power',
    },
    podcast: {
      say: 'One simple equation from the 1600s explains everything from sports cars to SpaceX rockets.',
      headline: 'Ep. 04 · The Force Equation',
    },
  },
  'ph-value': {
    stickman: {
      say: 'What do sour lemons, pure water and drain cleaner have in common? One secret scale from 0 to 14.',
      headline: 'The 0–14 Acid Scale',
    },
    makeup: {
      say: 'If your cleanser ruins your skin barrier, you need to understand the pH scale right now.',
      headline: 'GRWM · Why Skin pH Matters',
    },
    sport: {
      say: 'From hydration drinks to recovery, your body guards its pH balance down to the decimal.',
      headline: 'Hydration & Acid Balance',
    },
    podcast: {
      say: 'Every liquid around you sits on a hidden logarithmic scale that decides if it refreshes or burns.',
      headline: 'Ep. 05 · Acids, Bases & You',
    },
  },
  'present-perfect': {
    stickman: {
      say: 'Stop mixing up "I did it" and "I have done it"—here is the 10-second rule native speakers use.',
      headline: 'The 10-Second Grammar Fix',
    },
    makeup: {
      say: 'While this lip gloss sets—let’s fix the number one English mistake everyone makes in texts.',
      headline: 'GRWM · Level Up Your English',
    },
    sport: {
      say: '"We won" vs. "We have won"—why champions use the present perfect when the streak still counts.',
      headline: 'Talk Like a Champion',
    },
    podcast: {
      say: 'One subtle tense change connects something you did yesterday to what matters right now.',
      headline: 'Ep. 06 · Past Action, Present Impact',
    },
  },
  'quadratic-formula': {
    stickman: {
      say: 'Looks terrifying on the chalkboard, right? It is actually a cheat code that solves any curve.',
      headline: 'The Curve Cheat Code',
    },
    makeup: {
      say: 'Don’t panic at the math—once you know this one secret part under the root, you already know the answer.',
      headline: 'GRWM · Math Without the Stress',
    },
    sport: {
      say: 'Every three-pointer arc in basketball follows a quadratic curve. Here is how to solve where it lands.',
      headline: 'The 3-Pointer Arc Formula',
    },
    podcast: {
      say: 'Why did teachers make us memorize x equals minus b? Because it predicts every parabolic trajectory.',
      headline: 'Ep. 07 · Decoding the Parabola',
    },
  },
  'plate-tectonics': {
    stickman: {
      say: 'The ground under your feet is literally moving right now—at the exact speed your fingernails grow.',
      headline: 'The Ground Is Moving',
    },
    makeup: {
      say: 'Wait, wild thought while I do my blush: all continents used to be one giant island before they broke up.',
      headline: 'GRWM · The Biggest Breakup Ever',
    },
    sport: {
      say: 'The highest mountains on Earth were built by slow-motion collisions millions of times stronger than any tackle.',
      headline: 'Slow-Motion Titan Collisions',
    },
    podcast: {
      say: 'When Alfred Wegener said continents drift across the planet, experts laughed—until he was proven right.',
      headline: 'Ep. 08 · The Drifting Planet',
    },
  },
  'supply-demand': {
    stickman: {
      say: 'Why do concert tickets and sneakers suddenly cost 500 bucks? Two lines explain the whole game.',
      headline: 'Why Sneakers Cost $500',
    },
    makeup: {
      say: 'Ever wonder why a viral lip oil sells out and triples in price overnight? Let’s talk supply and demand.',
      headline: 'GRWM · Why Viral Products Triple',
    },
    sport: {
      say: 'Why do finals tickets cost ten times more than preseason? Market physics in 30 seconds.',
      headline: 'Finals Ticket Economics',
    },
    podcast: {
      say: 'Every price tag in your life—from coffee to rent—is decided by an invisible tug-of-war.',
      headline: 'Ep. 09 · The Invisible Tug-of-War',
    },
  },
  binary: {
    stickman: {
      say: 'Your phone, your games and this entire app are made of just two numbers: zero and one.',
      headline: 'Everything Is 0 and 1',
    },
    makeup: {
      say: 'Crazy fact while I curl my lashes: every filter and video on your phone is secretly just zeros and ones.',
      headline: 'GRWM · Behind Every Camera Filter',
    },
    sport: {
      say: 'Every stadium scoreboard and smartwatch tracker counts in powers of two under the hood.',
      headline: 'How Smartwatches Count',
    },
    podcast: {
      say: 'How do billions of tiny switches that only know ON or OFF simulate an entire digital world?',
      headline: 'Ep. 10 · The Language of Machines',
    },
  },
  cell: {
    stickman: {
      say: 'Right now, 30 trillion tiny cities are running inside your body—and none of them ever sleep.',
      headline: '30 Trillion Tiny Cities',
    },
    makeup: {
      say: 'Real glow starts at the cellular level—let’s look inside the tiny power plants keeping your skin alive.',
      headline: 'GRWM · Cellular Glow Up',
    },
    sport: {
      say: 'Want more stamina? Meet the microscopic power plants inside your muscles that generate every rep.',
      headline: 'Your Muscle Power Plants',
    },
    podcast: {
      say: 'We all remember the meme "mitochondria is the powerhouse of the cell"—here is what it actually does.',
      headline: 'Ep. 11 · Inside the Living Engine',
    },
  },
  ww1: {
    stickman: {
      say: 'How did one assassination in 1914 pull almost the entire planet into a four-year war?',
      headline: 'The Domino Effect of 1914',
    },
    makeup: {
      say: 'Storytime while I do eyeliner: in 1914 Europe had so many secret alliances that one spark set everything off.',
      headline: 'GRWM · The 1914 Chain Reaction',
    },
    sport: {
      say: 'Imagine two massive alliance teams locked in a four-year stalemate that reshaped the modern world.',
      headline: 'The 1914 Global Stalemate',
    },
    podcast: {
      say: 'June 1914 in Sarajevo: one moment triggered a chain of treaties nobody could stop.',
      headline: 'Ep. 12 · The Spark in Sarajevo',
    },
  },
  ohm: {
    stickman: {
      say: 'Think of electricity like water in a pipe: pressure pushes it, narrow pipes fight it.',
      headline: 'Electricity in 30 Seconds',
    },
    makeup: {
      say: 'Before I plug in my hair straightener—here is the tiny formula that stops your gadgets from frying.',
      headline: 'GRWM · How Your Gadgets Work',
    },
    sport: {
      say: 'Push harder against resistance and you get more flow—that works in the gym and in every circuit.',
      headline: 'Push vs. Resistance',
    },
    podcast: {
      say: 'Every battery, charger and EV on the road obeys one three-letter rule discovered by Georg Ohm.',
      headline: 'Ep. 13 · Volts, Amps & Ohms',
    },
  },
  'periodic-table': {
    stickman: {
      say: 'Every atom in the universe—from the gold on your finger to the air you breathe—fits on one cheat sheet.',
      headline: 'The Universe’s Cheat Sheet',
    },
    makeup: {
      say: 'Wait, from shimmer pigments to neon signs—every element has its own personality group on this chart.',
      headline: 'GRWM · Element Personalities',
    },
    sport: {
      say: 'From iron in your blood to carbon in your bike frame—here is how all building blocks are ranked.',
      headline: 'The Building Blocks of Gear',
    },
    podcast: {
      say: 'Why do some elements explode in water while group 18 refuses to react with anything at all?',
      headline: 'Ep. 14 · The Noble Outsiders',
    },
  },
  'first-conditional': {
    stickman: {
      say: 'If you watch this for 20 seconds, you will never mess up an "if" sentence in English again.',
      headline: 'Master "If" Sentences Now',
    },
    makeup: {
      say: 'Quick English hack while I apply lip liner: never say "If it will rain"—here is what sounds natural.',
      headline: 'GRWM · Sound Like a Native',
    },
    sport: {
      say: '"If we train hard, we will win"—how coaches talk about real future game plans in English.',
      headline: 'Game-Plan English',
    },
    podcast: {
      say: 'Cause and effect in the future: one simple grammar rule makes your predictions crystal clear.',
      headline: 'Ep. 15 · Cause & Future Effect',
    },
  },
  percentages: {
    stickman: {
      say: 'Want to calculate any sale discount or tip in your head in two seconds flat? Watch this.',
      headline: 'Mental Math in 2 Seconds',
    },
    makeup: {
      say: 'When Sephora has a 20% sale, don’t pull out your calculator—use this two-second mental trick.',
      headline: 'GRWM · Sale Math Made Easy',
    },
    sport: {
      say: 'Adding 10% to your personal record? Multiply by 1.10 and you have your new target weight instantly.',
      headline: 'Calculate Your Next PR',
    },
    podcast: {
      say: 'Interest rates, discounts, tax—once you see percentages as simple decimals, nobody can fool you.',
      headline: 'Ep. 16 · Everyday Number Sense',
    },
  },
  greenhouse: {
    stickman: {
      say: 'Without this invisible blanket of gas, Earth would be a frozen snowball at minus 18 degrees.',
      headline: 'Earth’s Invisible Blanket',
    },
    makeup: {
      say: 'Think of the atmosphere like a setting spray that locks heat in—great in moderation, bad in excess.',
      headline: 'GRWM · Why the Planet Warms',
    },
    sport: {
      say: 'Ever train in a hoodie and feel the heat trap? That is exactly what greenhouse gases do to Earth.',
      headline: 'The Hoodie Effect on Earth',
    },
    podcast: {
      say: 'The greenhouse effect actually made life on Earth possible—until fossil fuels turned the dial too high.',
      headline: 'Ep. 17 · The Thermostat of Earth',
    },
  },
  inflation: {
    stickman: {
      say: 'Your money didn’t shrink in your pocket—everything around it just got more expensive. Here is why.',
      headline: 'Why Your Money Buys Less',
    },
    makeup: {
      say: 'Why did iced coffee go from three bucks to seven? Let’s talk about inflation while I blend.',
      headline: 'GRWM · The $7 Iced Coffee',
    },
    sport: {
      say: 'If ticket prices sprint faster than your paycheck, your purchasing power loses the race.',
      headline: 'Outrunning Rising Prices',
    },
    podcast: {
      say: 'Why do central banks actually want 2% inflation every year instead of zero?',
      headline: 'Ep. 18 · The 2% Secret',
    },
  },
  algorithm: {
    stickman: {
      say: 'Everyone blames "the algorithm"—but what actually is an algorithm under the hood?',
      headline: 'What "The Algorithm" Really Is',
    },
    makeup: {
      say: 'Your skincare routine—cleanser, serum, SPF in exact order—is literally an algorithm.',
      headline: 'GRWM · Your Routine Is Code',
    },
    sport: {
      say: 'A playbook drill—read the defense, compare options, pick the open lane—is a real-life algorithm.',
      headline: 'Playbooks Are Algorithms',
    },
    podcast: {
      say: 'Strip away the buzzword and an algorithm is just a recipe that a computer can follow blindly.',
      headline: 'Ep. 19 · Recipes for Machines',
    },
  },
  dna: {
    stickman: {
      say: 'Every instruction to build a human being is written in an alphabet with only four letters.',
      headline: 'The 4-Letter Code of Life',
    },
    makeup: {
      say: 'Eye color, hair texture, freckles—it is all coded in a microscopic twisted ladder inside you.',
      headline: 'GRWM · Your Genetic Blueprint',
    },
    sport: {
      say: 'Fast-twitch muscle fibers and height potential are stored in a four-letter code inside every cell.',
      headline: 'The Athlete’s Blueprint',
    },
    podcast: {
      say: 'Four chemical bases—A, T, G and C—pair up like a zipper to store billions of years of evolution.',
      headline: 'Ep. 20 · The Double Helix Code',
    },
  },
  'skin-barrier': {
    stickman: {
      say: 'Why does your concealer look patchy even with expensive products? Meet your skin barrier and color wheel.',
      headline: 'The Science of Flawless Skin',
    },
    makeup: {
      say: 'Wait—before I blend this concealer, let me show you the color wheel trick that deletes redness in two seconds.',
      headline: 'GRWM · Color Theory & Skin Barrier',
    },
    sport: {
      say: 'Sweat, sun and harsh wash can strip your skin’s acid shield—here is how your outer barrier protects you.',
      headline: 'Protecting Your Skin Shield',
    },
    podcast: {
      say: 'Why is the beauty industry obsessed with pH 5 and color theory? Because chemistry decides how makeup sits.',
      headline: 'Ep. 21 · Chemistry of Beauty',
    },
  },
  'muscle-hypertrophy': {
    stickman: {
      say: 'Plot twist: your muscles actually shrink in the gym and only grow when you are asleep in bed.',
      headline: 'Muscles Grow While You Sleep',
    },
    makeup: {
      say: 'Post-pilates GRWM—did you know your muscles don’t actually tone during the workout, but while you sleep?',
      headline: 'GRWM · Beauty Sleep & Recovery',
    },
    sport: {
      say: 'Every heavy rep sends a mechanical signal to your fibers—here is what actually triggers muscle hypertrophy.',
      headline: 'The Science of Muscle Growth',
    },
    podcast: {
      say: 'Training breaks muscle down; recovery builds it back thicker. Let’s unpack progressive overload in 60 seconds.',
      headline: 'Ep. 22 · Stimulus vs. Recovery',
    },
  },
  'separation-powers': {
    stickman: {
      say: 'How do you stop a president or prime minister from making up their own rules? Split the power into three.',
      headline: 'The 3-Way Power Split',
    },
    makeup: {
      say: 'Quick politics tea while I do my lip combo: why can a court block a law that parliament just passed?',
      headline: 'GRWM · Checks & Balances Tea',
    },
    sport: {
      say: 'Imagine a match where the striker is also the referee and writes the rulebook—that is why democracies split power.',
      headline: 'Why Players Aren’t Referees',
    },
    podcast: {
      say: 'Lawmakers, government, and courts: why the separation of powers is the ultimate safeguard of any democracy.',
      headline: 'Ep. 23 · Who Watches the Rulers?',
    },
  },
};

export function getScenesWithHook(clip: Clip, vibe: VibeMode): Scene[] {
  const entry = CLIP_HOOKS[clip.id]?.[vibe];
  if (!entry) return clip.scenes;
  const hookScene: Scene = {
    say: entry.say,
    visual: {
      kind: 'formula',
      main: entry.headline,
      sub: `Hook · ${clip.title}`,
    },
  };
  return [hookScene, ...clip.scenes];
}
