// Demo/mock data for previewing the app without a backend

export const DEMO_MODE = false;

export const mockUser = {
  token: 'demo-token-123',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  role: 'STUDENT',
};

export const mockExams = [
  {
    examId: 1,
    examName: 'JEE',
    totalQuestions: 75,
    durationMinutes: 180,
    correctMarks: 4,
    wrongMarks: -1,
    unattemptedMarks: 0,
    papers: [
      { paperId: 1, paperName: 'Paper 1', subjects: ['Physics', 'Chemistry'] },
      { paperId: 2, paperName: 'Paper 2', subjects: ['Mathematics'] },
    ],
  },
  {
    examId: 2,
    examName: 'MHT-CET',
    totalQuestions: 150,
    durationMinutes: 180,
    correctMarks: 1,
    wrongMarks: 0,
    unattemptedMarks: 0,
    papers: [
      { paperId: 3, paperName: 'Paper 1', subjects: ['Physics', 'Chemistry'] },
      { paperId: 4, paperName: 'Paper 2', subjects: ['Mathematics'] },
    ],
  },
  {
    examId: 3,
    examName: 'BITSAT',
    totalQuestions: 130,
    durationMinutes: 180,
    correctMarks: 3,
    wrongMarks: -1,
    unattemptedMarks: 0,
    papers: [
      { paperId: 5, paperName: 'Paper 1', subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Logical Reasoning'] },
    ],
  },
  {
    examId: 4,
    examName: 'VIT',
    totalQuestions: 125,
    durationMinutes: 150,
    correctMarks: 1,
    wrongMarks: -1,
    unattemptedMarks: 0,
    papers: [
      { paperId: 6, paperName: 'Paper 1', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Aptitude'] },
    ],
  },
];

const physicsQuestions = [
  { chapter: 'Kinematics', text: 'A ball is thrown vertically upward with a velocity of 20 m/s. What is the maximum height reached?', options: ['10 m', '20 m', '30 m', '40 m'], correct: 'B' },
  { chapter: 'Kinematics', text: 'The displacement-time graph of a moving particle is a straight line with positive slope. The velocity of the particle is:', options: ['Increasing', 'Decreasing', 'Constant', 'Zero'], correct: 'C' },
  { chapter: 'Newton\'s Laws', text: 'A body of mass 5 kg is acted upon by two perpendicular forces 8N and 6N. The magnitude of acceleration is:', options: ['2 m/s²', '1.5 m/s²', '3 m/s²', '4 m/s²'], correct: 'A' },
  { chapter: 'Work & Energy', text: 'A body of mass 2 kg has a velocity of 4 m/s. Its kinetic energy is:', options: ['8 J', '16 J', '32 J', '4 J'], correct: 'B' },
  { chapter: 'Gravitation', text: 'The escape velocity from Earth is approximately:', options: ['7.9 km/s', '11.2 km/s', '15.4 km/s', '3.2 km/s'], correct: 'B' },
  { chapter: 'Rotational Motion', text: 'The moment of inertia of a solid sphere about its diameter is:', options: ['2/5 MR²', '2/3 MR²', '1/2 MR²', 'MR²'], correct: 'A' },
  { chapter: 'Oscillations', text: 'The time period of a simple pendulum of length 1m on Earth (g=10 m/s²) is approximately:', options: ['1 s', '2 s', '3 s', '4 s'], correct: 'B' },
  { chapter: 'Waves', text: 'The speed of sound in air at 20°C is approximately:', options: ['300 m/s', '332 m/s', '343 m/s', '360 m/s'], correct: 'C' },
  { chapter: 'Thermodynamics', text: 'In an isothermal process, the internal energy of an ideal gas:', options: ['Increases', 'Decreases', 'Remains constant', 'Becomes zero'], correct: 'C' },
  { chapter: 'Electrostatics', text: 'Two point charges of +2μC and -2μC are placed 10 cm apart. The electric field at the midpoint is:', options: ['Zero', '7.2 × 10⁵ N/C', '1.44 × 10⁶ N/C', '2.88 × 10⁶ N/C'], correct: 'D' },
];

const chemistryQuestions = [
  { chapter: 'Atomic Structure', text: 'The maximum number of electrons in a shell with principal quantum number n=3 is:', options: ['8', '18', '32', '2'], correct: 'B' },
  { chapter: 'Chemical Bonding', text: 'The shape of SF₆ molecule is:', options: ['Tetrahedral', 'Square planar', 'Trigonal bipyramidal', 'Octahedral'], correct: 'D' },
  { chapter: 'Periodic Table', text: 'Which of the following has the highest electronegativity?', options: ['Oxygen', 'Fluorine', 'Nitrogen', 'Chlorine'], correct: 'B' },
  { chapter: 'States of Matter', text: 'At STP, the volume of 1 mole of an ideal gas is:', options: ['11.2 L', '22.4 L', '44.8 L', '5.6 L'], correct: 'B' },
  { chapter: 'Equilibrium', text: 'The pH of a 0.01 M HCl solution is:', options: ['1', '2', '3', '4'], correct: 'B' },
  { chapter: 'Thermodynamics', text: 'For an exothermic reaction at constant pressure, ΔH is:', options: ['Positive', 'Negative', 'Zero', 'Undefined'], correct: 'B' },
  { chapter: 'Redox Reactions', text: 'In the reaction 2Na + Cl₂ → 2NaCl, sodium is:', options: ['Oxidized', 'Reduced', 'Neither', 'Both'], correct: 'A' },
  { chapter: 'Organic Chemistry', text: 'The IUPAC name of CH₃-CH₂-CHO is:', options: ['Propanol', 'Propanal', 'Propanone', 'Propanoic acid'], correct: 'B' },
  { chapter: 'Hydrocarbons', text: 'Which of the following is an aromatic compound?', options: ['Cyclohexane', 'Benzene', 'Ethylene', 'Acetylene'], correct: 'B' },
  { chapter: 'Solutions', text: 'The molarity of a solution containing 4g NaOH in 500 mL is:', options: ['0.1 M', '0.2 M', '0.5 M', '1.0 M'], correct: 'B' },
];

const mathQuestions = [
  { chapter: 'Quadratic Equations', text: 'The roots of x² - 5x + 6 = 0 are:', options: ['2, 3', '1, 6', '-2, -3', '3, -2'], correct: 'A' },
  { chapter: 'Trigonometry', text: 'The value of sin(30°) + cos(60°) is:', options: ['0', '1', '1/2', '√3/2'], correct: 'B' },
  { chapter: 'Calculus', text: 'The derivative of x³ + 2x with respect to x is:', options: ['3x² + 2', 'x² + 2', '3x + 2', '3x²'], correct: 'A' },
  { chapter: 'Matrices', text: 'If A is a 3×3 matrix with |A| = 5, then |3A| is:', options: ['15', '45', '135', '5'], correct: 'C' },
  { chapter: 'Probability', text: 'Two dice are thrown. The probability of getting a sum of 7 is:', options: ['1/6', '5/36', '1/12', '7/36'], correct: 'A' },
  { chapter: 'Vectors', text: 'If |a⃗| = 3 and |b⃗| = 4, and a⃗ · b⃗ = 0, then |a⃗ + b⃗| is:', options: ['5', '7', '1', '12'], correct: 'A' },
  { chapter: 'Integration', text: '∫₀¹ x² dx equals:', options: ['1/2', '1/3', '1/4', '1'], correct: 'B' },
  { chapter: 'Complex Numbers', text: 'The modulus of (3 + 4i) is:', options: ['5', '7', '1', '25'], correct: 'A' },
  { chapter: 'Sequences', text: 'The 10th term of AP: 2, 5, 8, 11, ... is:', options: ['29', '32', '26', '35'], correct: 'A' },
  { chapter: 'Coordinate Geometry', text: 'The distance between points (1,2) and (4,6) is:', options: ['5', '7', '3', '25'], correct: 'A' },
];

function buildQuestions(subjects: string[], count: number) {
  const pool: Record<string, typeof physicsQuestions> = {
    Physics: physicsQuestions,
    Chemistry: chemistryQuestions,
    Mathematics: mathQuestions,
  };
  const result: any[] = [];
  let id = 1;
  const perSubject = Math.ceil(count / subjects.length);
  
  for (const subject of subjects) {
    const qs = pool[subject] || physicsQuestions;
    for (let i = 0; i < perSubject && result.length < count; i++) {
      const q = qs[i % qs.length];
      result.push({
        id: id++,
        questionText: q.text,
        optionA: q.options[0],
        optionB: q.options[1],
        optionC: q.options[2],
        optionD: q.options[3],
        subject,
        chapter: q.chapter,
        correctOption: q.correct,
      });
    }
  }
  return result;
}

export function getMockQuestions(examId: number, paperId: number) {
  const exam = mockExams.find(e => e.examId === examId);
  const paper = exam?.papers.find(p => p.paperId === paperId);
  if (!paper) return buildQuestions(['Physics'], 10);
  const perPaper = Math.ceil((exam?.totalQuestions || 30) / (exam?.papers.length || 1));
  return buildQuestions(paper.subjects, perPaper);
}

export function getMockResult(attemptId: number) {
  const questions = buildQuestions(['Physics', 'Chemistry', 'Mathematics'], 75);
  const questionResults = questions.map((q, i) => {
    let result: string;
    let selectedOption: string | null;
    if (i % 5 === 0) { result = 'WRONG'; selectedOption = 'C'; }
    else if (i % 7 === 0) { result = 'UNATTEMPTED'; selectedOption = null; }
    else { result = 'CORRECT'; selectedOption = q.correctOption; }
    return {
      questionId: q.id,
      responseId: 1000 + q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      subject: q.subject,
      chapter: q.chapter,
      correctOption: q.correctOption,
      selectedOption,
      result,
    };
  });

  const correct = questionResults.filter(q => q.result === 'CORRECT').length;
  const wrong = questionResults.filter(q => q.result === 'WRONG').length;
  const unattempted = questionResults.filter(q => q.result === 'UNATTEMPTED').length;

  return {
    attemptId,
    examName: 'JEE',
    score: correct * 4 - wrong * 1,
    totalMarks: 300,
    correct,
    wrong,
    unattempted,
    percentile: 78.5,
    percentileReady: true,
    questionResults,
  };
}

export function getMockExplanations(attemptId: number) {
  const result = getMockResult(attemptId);
  const map: Record<string, string> = {};
  result.questionResults.forEach(qr => {
    if (qr.result === 'WRONG' || qr.result === 'UNATTEMPTED') {
      map[qr.responseId] = `The correct answer is option ${qr.correctOption}. This question tests your understanding of ${qr.chapter} in ${qr.subject}. The key concept here is to apply the fundamental formula and carefully substitute the given values. Many students make errors by not paying attention to the units or sign conventions. Remember to always verify your answer by checking dimensions and boundary conditions.`;
    }
  });
  return map;
}
