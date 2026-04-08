interface QuestionPaletteProps {
  questions: { id: number; subject: string }[];
  answers: Record<number, string | null>;
  visitedSet: Set<number>;
  currentIndex: number;
  onJump: (index: number) => void;
}

const QuestionPalette = ({ questions, answers, visitedSet, currentIndex, onJump }: QuestionPaletteProps) => {
  const answered = questions.filter(q => answers[q.id] != null).length;
  const notAnswered = questions.filter(q => answers[q.id] == null && visitedSet.has(q.id)).length;
  const notVisited = questions.filter(q => !visitedSet.has(q.id)).length;

  // Group by subject
  const subjects: { name: string; startIdx: number; endIdx: number }[] = [];
  let lastSubject = '';
  questions.forEach((q, i) => {
    if (q.subject !== lastSubject) {
      subjects.push({ name: q.subject, startIdx: i, endIdx: i });
      lastSubject = q.subject;
    } else {
      subjects[subjects.length - 1].endIdx = i;
    }
  });

  const getColor = (idx: number) => {
    const q = questions[idx];
    if (idx === currentIndex) return 'ring-2 ring-primary ring-offset-2';
    if (answers[q.id] != null) return 'bg-success text-success-foreground';
    if (visitedSet.has(q.id)) return 'bg-destructive text-destructive-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4">
      <h3 className="font-semibold text-foreground mb-3">Question Palette</h3>
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 text-success font-medium">
          <span className="h-2 w-2 rounded-full bg-success" /> {answered} Answered
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
          <span className="h-2 w-2 rounded-full bg-destructive" /> {notAnswered} Not Answered
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> {notVisited} Not Visited
        </span>
      </div>

      {subjects.map((subj) => (
        <div key={subj.name} className="mb-4">
          <p className="text-xs text-muted-foreground font-medium mb-2">
            {subj.name} (Q{subj.startIdx + 1}–Q{subj.endIdx + 1})
          </p>
          <div className="grid grid-cols-5 gap-2">
            {questions.slice(subj.startIdx, subj.endIdx + 1).map((_, i) => {
              const absIdx = subj.startIdx + i;
              return (
                <button
                  key={absIdx}
                  onClick={() => onJump(absIdx)}
                  className={`h-9 w-full rounded-lg text-xs font-semibold transition-all ${getColor(absIdx)}`}
                >
                  {absIdx + 1}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionPalette;
