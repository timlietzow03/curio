import type { Clip } from '@/lib/types';

/**
 * Mock lessons. Each clip is a few narrated scenes (text-to-speech in the browser).
 * To use real videos, add `videoUrl` to a clip and the player plays the file instead.
 * Channels are fictional.
 */
export const CLIPS: Clip[] = [
  {
    id: 'pythagoras',
    subject: 'Math',
    hue: 216,
    title: 'The Pythagorean Theorem',
    channel: { name: 'Math with Mira', verified: true },
    scenes: [
      {
        say: 'The Pythagorean theorem only works in a right-angled triangle.',
        visual: { kind: 'formula', main: 'a² + b² = c²', sub: 'right-angled triangle' },
      },
      {
        say: 'The two shorter sides are called legs. The longest side, opposite the right angle, is the hypotenuse.',
        visual: { kind: 'points', items: ['a and b = legs', 'c = hypotenuse (longest side)'] },
      },
      {
        say: 'Example: a is three and b is four. Nine plus sixteen equals twenty-five, so c is five.',
        visual: { kind: 'formula', main: '9 + 16 = 25', sub: 'c = √25 = 5' },
      },
    ],
    quiz: {
      q: 'What is the longest side of a right-angled triangle called?',
      options: ['Hypotenuse', 'Leg', 'Diagonal'],
      answer: 0,
      explain: 'The hypotenuse is opposite the right angle.',
    },
  },
  {
    id: 'photosynthesis',
    subject: 'Biology',
    hue: 204,
    title: 'Photosynthesis in 60 Seconds',
    channel: { name: 'BioBlitz', verified: true },
    scenes: [
      {
        say: 'In photosynthesis, plants make sugar. They need light, water and carbon dioxide.',
        visual: { kind: 'points', items: ['Light', 'Water (H₂O)', 'Carbon dioxide (CO₂)'] },
      },
      {
        say: 'It happens in the chloroplasts. The green pigment chlorophyll captures the light.',
        visual: { kind: 'points', items: ['Where: chloroplasts', 'Chlorophyll captures light'] },
      },
      {
        say: 'The result is glucose and oxygen.',
        visual: { kind: 'formula', main: '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂', sub: 'powered by light' },
      },
    ],
    quiz: {
      q: 'Which gas do plants release during photosynthesis?',
      options: ['Oxygen', 'Nitrogen', 'Hydrogen'],
      answer: 0,
      explain: 'Oxygen (O₂) is a by-product.',
    },
  },
  {
    id: 'revolution',
    subject: 'History',
    hue: 228,
    title: 'The French Revolution',
    channel: { name: 'History in a Nutshell', verified: true },
    scenes: [
      {
        say: 'The French Revolution begins in 1789. Many people are angry about high taxes and the privileges of the nobility.',
        visual: { kind: 'points', items: ['High taxes', 'Privileges for nobles and clergy', 'Rising bread prices'] },
      },
      {
        say: 'On the fourteenth of July 1789, Parisians storm the Bastille. It becomes a symbol of the uprising.',
        visual: { kind: 'timeline', events: [{ year: '1789', label: 'Storming of the Bastille' }] },
      },
      {
        say: 'France then becomes a republic, the king is executed, and in 1799 Napoleon takes power.',
        visual: {
          kind: 'timeline',
          events: [
            { year: '1789', label: 'Storming of the Bastille' },
            { year: '1792', label: 'France becomes a republic' },
            { year: '1793', label: 'Louis XVI is executed' },
            { year: '1799', label: 'Napoleon takes power' },
          ],
        },
      },
    ],
    quiz: {
      q: 'What did Parisians storm on 14 July 1789?',
      options: ['The Bastille', 'The Palace of Versailles', 'Notre-Dame'],
      answer: 0,
      explain: 'The Bastille was a state prison and a symbol of royal power.',
    },
  },
  {
    id: 'newton',
    subject: 'Physics',
    hue: 212,
    title: "Newton's Second Law",
    channel: { name: 'Physics Pure', verified: true },
    scenes: [
      {
        say: "Newton's second law says: the more mass something has, the more force you need to accelerate it.",
        visual: { kind: 'formula', main: 'F = m · a', sub: 'force = mass × acceleration' },
      },
      {
        say: 'The unit of force is the newton. One newton is one kilogram metre per second squared.',
        visual: { kind: 'formula', main: '1 N = 1 kg · m/s²' },
      },
      {
        say: 'Example: a two kilogram cart accelerates at three metres per second squared. That takes six newtons.',
        visual: { kind: 'formula', main: '2 kg · 3 m/s² = 6 N' },
      },
    ],
    quiz: {
      q: 'What is the force for m = 5 kg and a = 2 m/s²?',
      options: ['10 N', '7 N', '2.5 N'],
      answer: 0,
      explain: 'F = m · a = 5 kg · 2 m/s² = 10 N.',
    },
  },
  {
    id: 'ph-value',
    subject: 'Chemistry',
    hue: 220,
    title: 'The pH Scale',
    channel: { name: 'Chem Check', verified: true },
    scenes: [
      {
        say: 'The pH value shows how acidic or basic a solution is. It depends on the concentration of hydronium ions.',
        visual: { kind: 'formula', main: 'pH = −log₁₀ c(H₃O⁺)' },
      },
      {
        say: 'A pH of seven is neutral. Below seven a solution is acidic, above seven it is basic.',
        visual: { kind: 'points', items: ['pH < 7: acidic', 'pH = 7: neutral', 'pH > 7: basic'] },
      },
      {
        say: 'Pure water has a pH of seven at room temperature. Lemon juice is around two.',
        visual: { kind: 'points', items: ['Pure water: pH 7', 'Lemon juice: about pH 2'] },
      },
    ],
    quiz: {
      q: 'Which pH value is neutral?',
      options: ['7', '0', '14'],
      answer: 0,
      explain: 'At pH 7 there are equal amounts of H₃O⁺ and OH⁻ ions.',
    },
  },
  {
    id: 'present-perfect',
    subject: 'English',
    hue: 234,
    title: 'Present Perfect',
    channel: { name: 'English in 60', verified: true },
    scenes: [
      {
        say: 'Use the present perfect when a past action matters now.',
        visual: { kind: 'formula', main: 'have / has + past participle', sub: 'I have seen it.' },
      },
      {
        say: 'Typical signal words are already, yet, ever, never and just.',
        visual: { kind: 'points', items: ['already', 'yet', 'ever / never', 'just'] },
      },
      {
        say: 'Example: She has finished her homework. It is done, and the result matters now.',
        visual: { kind: 'formula', main: 'She has finished her homework.' },
      },
    ],
    quiz: {
      q: 'Which sentence is correct?',
      options: ['He has gone home.', 'He have gone home.', 'He has went home.'],
      answer: 0,
      explain: 'With he, she and it, use has, followed by the participle: gone.',
    },
  },
  {
    id: 'quadratic-formula',
    subject: 'Math',
    hue: 208,
    title: 'The Quadratic Formula',
    channel: { name: 'Math with Mira', verified: true },
    scenes: [
      {
        say: 'The quadratic formula solves equations of the form a x squared plus b x plus c equals zero.',
        visual: { kind: 'formula', main: 'x = (−b ± √(b² − 4ac)) / 2a' },
      },
      {
        say: 'The part under the root is called the discriminant. If it is positive there are two solutions, if it is zero there is one, and if it is negative there is no real solution.',
        visual: { kind: 'points', items: ['D > 0: two solutions', 'D = 0: one solution', 'D < 0: no real solution'] },
      },
      {
        say: 'Example: x squared minus five x plus six equals zero. The discriminant is one, and the solutions are two and three.',
        visual: { kind: 'formula', main: 'x² − 5x + 6 = 0', sub: 'x₁ = 3 and x₂ = 2' },
      },
    ],
    quiz: {
      q: 'What does D < 0 mean for a quadratic equation?',
      options: ['No real solution', 'Two solutions', 'Exactly one solution'],
      answer: 0,
      explain: 'You cannot take the square root of a negative number among the real numbers.',
    },
  },
  {
    id: 'plate-tectonics',
    subject: 'Geography',
    hue: 202,
    title: 'Plate Tectonics',
    channel: { name: 'Earth Explained', verified: true },
    scenes: [
      {
        say: "The Earth's outer shell is made of huge plates. They slowly drift on the hot, flowing mantle.",
        visual: { kind: 'points', items: ['Lithospheric plates', 'A few centimetres per year'] },
      },
      {
        say: 'Where plates meet, we get earthquakes, volcanoes and mountains.',
        visual: { kind: 'points', items: ['Earthquakes', 'Volcanoes', 'Mountains'] },
      },
      {
        say: 'In 1912, Alfred Wegener proposed continental drift. He believed all continents were once joined as Pangaea.',
        visual: { kind: 'points', items: ['Alfred Wegener, 1912', 'Supercontinent Pangaea'] },
      },
    ],
    quiz: {
      q: 'How fast do tectonic plates move?',
      options: ['A few centimetres per year', 'Several metres per day', 'About one kilometre per year'],
      answer: 0,
      explain: 'Roughly as fast as your fingernails grow.',
    },
  },
  {
    id: 'supply-demand',
    subject: 'Economics',
    hue: 230,
    title: 'Supply and Demand',
    channel: { name: 'Economics Easy', verified: true },
    scenes: [
      {
        say: 'In a market, supply and demand meet. Sellers want to sell, buyers want to buy.',
        visual: { kind: 'points', items: ['Supply = sellers', 'Demand = buyers'] },
      },
      {
        say: 'When the price goes up, usually fewer people want to buy, but sellers want to sell more.',
        visual: { kind: 'points', items: ['Price up → demand down', 'Price up → supply up'] },
      },
      {
        say: 'The price where both sides agree is called the equilibrium price.',
        visual: { kind: 'formula', main: 'Supply = Demand', sub: 'equilibrium price' },
      },
    ],
    quiz: {
      q: 'What is the price called where supply equals demand?',
      options: ['Equilibrium price', 'Price ceiling', 'Price floor'],
      answer: 0,
      explain: 'At this price nothing is left over and nothing is missing.',
    },
  },
  {
    id: 'binary',
    subject: 'Computer Science',
    hue: 214,
    title: 'Binary Numbers',
    channel: { name: 'Code & Co', verified: true },
    scenes: [
      {
        say: 'Computers calculate with binary numbers. There are only two digits: zero and one.',
        visual: { kind: 'formula', main: 'Binary: 0 and 1' },
      },
      {
        say: 'Each position has a value: one, two, four, eight and so on. They are always powers of two.',
        visual: { kind: 'points', items: ['1 · 2 · 4 · 8 · 16 …', 'Powers of two'] },
      },
      {
        say: 'Example: one zero one one is eight plus two plus one, so eleven.',
        visual: { kind: 'formula', main: '1011₂ = 8 + 2 + 1 = 11' },
      },
    ],
    quiz: {
      q: 'Which decimal number is 101 in binary?',
      options: ['5', '3', '10'],
      answer: 0,
      explain: '101 in binary = 4 + 0 + 1 = 5.',
    },
  },
  {
    id: 'cell',
    subject: 'Biology',
    hue: 206,
    title: 'Inside a Cell',
    channel: { name: 'BioBlitz', verified: true },
    scenes: [
      {
        say: 'Every living thing is made of cells. The nucleus is the control centre and holds the DNA.',
        visual: { kind: 'points', items: ['Nucleus: holds the DNA', 'Cell membrane: controls what goes in and out'] },
      },
      {
        say: 'The mitochondria release energy from sugar. That is why they are called the powerhouses of the cell.',
        visual: { kind: 'points', items: ['Mitochondria: energy (ATP)', 'Ribosomes: build proteins'] },
      },
      {
        say: 'Plant cells also have a cell wall and chloroplasts. Animal cells do not.',
        visual: { kind: 'points', items: ['Cell wall', 'Chloroplasts', 'Only in plant cells'] },
      },
    ],
    quiz: {
      q: "Which organelle releases most of the cell's energy?",
      options: ['Mitochondria', 'Nucleus', 'Ribosome'],
      answer: 0,
      explain: "Mitochondria produce most of the cell's ATP.",
    },
  },
  {
    id: 'ww1',
    subject: 'History',
    hue: 226,
    title: 'The First World War',
    channel: { name: 'History in a Nutshell', verified: true },
    scenes: [
      {
        say: 'In June 1914, the heir to the Austrian throne, Archduke Franz Ferdinand, was assassinated in Sarajevo.',
        visual: { kind: 'timeline', events: [{ year: '1914', label: 'Assassination in Sarajevo' }] },
      },
      {
        say: 'Alliances pulled one country after another into the war. Within weeks, much of Europe was fighting.',
        visual: { kind: 'points', items: ['Allies: Britain, France, Russia', 'Central Powers: Germany, Austria-Hungary'] },
      },
      {
        say: 'The fighting stopped with an armistice on the eleventh of November 1918.',
        visual: {
          kind: 'timeline',
          events: [
            { year: '1914', label: 'The war begins' },
            { year: '1918', label: 'Armistice' },
          ],
        },
      },
    ],
    quiz: {
      q: 'In which year did the First World War begin?',
      options: ['1914', '1918', '1939'],
      answer: 0,
      explain: 'It began in 1914 and the fighting ended in 1918.',
    },
  },
  {
    id: 'ohm',
    subject: 'Physics',
    hue: 210,
    title: "Ohm's Law",
    channel: { name: 'Physics Pure', verified: true },
    scenes: [
      {
        say: "Ohm's law links voltage, current and resistance.",
        visual: { kind: 'formula', main: 'U = R · I', sub: 'voltage = resistance × current' },
      },
      {
        say: 'Voltage is measured in volts, resistance in ohms and current in amperes.',
        visual: { kind: 'points', items: ['U in volts (V)', 'R in ohms (Ω)', 'I in amperes (A)'] },
      },
      {
        say: 'Example: a twelve volt battery drives a four ohm resistor. The current is three amperes.',
        visual: { kind: 'formula', main: 'I = U / R = 12 V / 4 Ω = 3 A' },
      },
    ],
    quiz: {
      q: 'What is the current for U = 10 V and R = 5 Ω?',
      options: ['2 A', '50 A', '0.5 A'],
      answer: 0,
      explain: 'I = U / R = 10 V / 5 Ω = 2 A.',
    },
  },
  {
    id: 'periodic-table',
    subject: 'Chemistry',
    hue: 218,
    title: 'The Periodic Table',
    channel: { name: 'Chem Check', verified: true },
    scenes: [
      {
        say: 'The periodic table orders all elements by their atomic number. That is the number of protons in the nucleus.',
        visual: { kind: 'formula', main: 'Atomic number = protons' },
      },
      {
        say: 'Columns are called groups. Elements in the same group behave in a similar way. Rows are called periods.',
        visual: { kind: 'points', items: ['Columns = groups', 'Rows = periods'] },
      },
      {
        say: 'The noble gases in group eighteen, like helium and neon, rarely react with other elements.',
        visual: { kind: 'points', items: ['Group 18: noble gases', 'Helium, neon, argon', 'Rarely react'] },
      },
    ],
    quiz: {
      q: 'What are the elements ordered by in the periodic table?',
      options: ['Atomic number', 'Alphabet', 'Date of discovery'],
      answer: 0,
      explain: 'The atomic number is the number of protons.',
    },
  },
  {
    id: 'first-conditional',
    subject: 'English',
    hue: 236,
    title: 'First Conditional',
    channel: { name: 'English in 60', verified: true },
    scenes: [
      {
        say: 'Use the first conditional for real possibilities in the future.',
        visual: { kind: 'formula', main: 'If + present simple, will + verb', sub: 'If it rains, I will stay home.' },
      },
      {
        say: 'The if part uses the present simple, even though it talks about the future.',
        visual: { kind: 'points', items: ['If I study, I will pass.', 'Not: If I will study'] },
      },
      {
        say: 'Example: If you heat ice, it will melt.',
        visual: { kind: 'formula', main: 'If you heat ice, it will melt.' },
      },
    ],
    quiz: {
      q: 'Which sentence is correct?',
      options: ['If it rains, we will stay home.', 'If it will rain, we stay home.', 'If it rains, we would stay home.'],
      answer: 0,
      explain: 'After if, use the present simple. The result part uses will.',
    },
  },
  {
    id: 'percentages',
    subject: 'Math',
    hue: 212,
    title: 'Percentages',
    channel: { name: 'Math with Mira', verified: true },
    scenes: [
      {
        say: 'A percentage tells you how many parts out of one hundred.',
        visual: { kind: 'formula', main: 'p % = p / 100' },
      },
      {
        say: 'To find a percentage of a number, multiply by the percentage divided by one hundred. Twenty percent of one hundred fifty is thirty.',
        visual: { kind: 'formula', main: '20 % of 150 = 0.20 · 150 = 30' },
      },
      {
        say: 'For a ten percent increase, multiply by one point one. Eighty becomes eighty-eight.',
        visual: { kind: 'formula', main: '80 · 1.10 = 88', sub: '+10 % = × 1.10' },
      },
    ],
    quiz: {
      q: 'What is 25 % of 200?',
      options: ['50', '25', '75'],
      answer: 0,
      explain: '0.25 · 200 = 50.',
    },
  },
  {
    id: 'greenhouse',
    subject: 'Geography',
    hue: 203,
    title: 'The Greenhouse Effect',
    channel: { name: 'Earth Explained', verified: true },
    scenes: [
      {
        say: 'Some gases in the air, like carbon dioxide and methane, trap heat from the Sun. This is the greenhouse effect.',
        visual: { kind: 'points', items: ['Carbon dioxide (CO₂)', 'Methane (CH₄)', 'Water vapour'] },
      },
      {
        say: 'Without it, the average temperature on Earth would be about minus eighteen degrees. With it, it is around plus fifteen.',
        visual: { kind: 'points', items: ['Without: about −18 °C', 'With: about +15 °C'] },
      },
      {
        say: 'The problem: burning coal, oil and gas adds more carbon dioxide, so the planet warms faster.',
        visual: { kind: 'points', items: ['Fossil fuels add CO₂', 'More heat is trapped', 'Global warming'] },
      },
    ],
    quiz: {
      q: 'Which of these is a greenhouse gas?',
      options: ['Carbon dioxide', 'Argon', 'Nitrogen'],
      answer: 0,
      explain: 'Nitrogen and argon do not trap heat. Carbon dioxide does.',
    },
  },
  {
    id: 'inflation',
    subject: 'Economics',
    hue: 231,
    title: 'What Is Inflation?',
    channel: { name: 'Economics Easy', verified: true },
    scenes: [
      {
        say: 'Inflation means that prices rise across the economy over time.',
        visual: { kind: 'points', items: ['General price increase', 'Money buys less'] },
      },
      {
        say: 'If prices rise faster than wages, you can afford less than before. Economists call this a loss of purchasing power.',
        visual: { kind: 'formula', main: 'Purchasing power ↓', sub: 'when prices rise faster than wages' },
      },
      {
        say: 'Central banks, like the European Central Bank, aim for about two percent inflation per year.',
        visual: { kind: 'points', items: ['Target: about 2 % per year', 'Tool: interest rates'] },
      },
    ],
    quiz: {
      q: 'What happens to purchasing power when prices rise faster than wages?',
      options: ['It falls', 'It rises', 'It stays the same'],
      answer: 0,
      explain: 'Your money buys less than before.',
    },
  },
  {
    id: 'algorithm',
    subject: 'Computer Science',
    hue: 215,
    title: 'What Is an Algorithm?',
    channel: { name: 'Code & Co', verified: true },
    scenes: [
      {
        say: 'An algorithm is a step-by-step set of instructions to solve a problem.',
        visual: { kind: 'formula', main: 'Algorithm = clear steps' },
      },
      {
        say: 'Think of a recipe. It has a clear start, clear steps in the right order, and an end result.',
        visual: { kind: 'points', items: ['Clear steps', 'Right order', 'Ends with a result'] },
      },
      {
        say: 'Example: to find the largest number in a list, look at each number and remember the biggest one so far.',
        visual: {
          kind: 'points',
          items: ['Start with the first number', 'Compare with the next one', 'Keep the bigger one', 'Repeat until the end'],
        },
      },
    ],
    quiz: {
      q: 'What is an algorithm?',
      options: ['A step-by-step set of instructions', 'A type of computer', 'A programming language'],
      answer: 0,
      explain: 'An algorithm describes how to solve a problem in clear steps.',
    },
  },
  {
    id: 'dna',
    subject: 'Biology',
    hue: 207,
    title: 'DNA in a Minute',
    channel: { name: 'BioBlitz', verified: true },
    scenes: [
      {
        say: 'DNA stores genetic information. It looks like a twisted ladder called a double helix.',
        visual: { kind: 'formula', main: 'DNA = double helix' },
      },
      {
        say: 'The rungs of the ladder are made of four bases: adenine, thymine, guanine and cytosine.',
        visual: { kind: 'points', items: ['A: adenine', 'T: thymine', 'G: guanine', 'C: cytosine'] },
      },
      {
        say: 'The bases always pair the same way. Adenine pairs with thymine, and guanine pairs with cytosine.',
        visual: { kind: 'formula', main: 'A – T and G – C' },
      },
    ],
    quiz: {
      q: 'Which base pairs with adenine?',
      options: ['Thymine', 'Guanine', 'Cytosine'],
      answer: 0,
      explain: 'In DNA, A always pairs with T.',
    },
  },
];
