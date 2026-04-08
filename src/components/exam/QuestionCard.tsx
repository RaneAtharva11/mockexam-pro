interface QuestionCardProps {
  questionNumber: number;
  subject: string;
  chapter?: string;
  questionText: string;
  options: { key: string; text: string }[];
  selectedOption: string | null;
  onSelectOption: (key: string) => void;
  onClear: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const optionLabels = ['A', 'B', 'C', 'D'];

const QuestionCard = ({
  questionNumber, subject, chapter, questionText, options,
  selectedOption, onSelectOption, onClear, onNext, onPrevious, hasPrevious, hasNext,
}: QuestionCardProps) => (
  <div className="flex flex-col gap-6">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-primary text-primary-foreground text-sm font-bold">
          Q.{questionNumber}
        </span>
        <span className="text-sm text-muted-foreground">{subject}{chapter ? ` • ${chapter}` : ''}</span>
      </div>
      <p className="text-lg leading-relaxed text-foreground">{questionText}</p>
    </div>

    <div className="flex flex-col gap-3">
      {options.map((opt, i) => {
        const isSelected = selectedOption === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onSelectOption(opt.key)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-4 ${
              isSelected
                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'
            }`}
          >
            <span className={`flex-shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
              isSelected ? 'border-primary-foreground text-primary-foreground' : 'border-muted-foreground/40 text-muted-foreground'
            }`}>
              {optionLabels[i]}
            </span>
            <span className="text-sm leading-relaxed">{opt.text}</span>
          </button>
        );
      })}
    </div>

    <div className="flex items-center justify-between pt-2 border-t">
      <button onClick={onClear} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Clear Response
      </button>
      <button onClick={onNext} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
        Save & Next
      </button>
    </div>

    <div className="flex justify-between">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
      >
        ← Previous
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
      >
        Next →
      </button>
    </div>
  </div>
);

export default QuestionCard;
