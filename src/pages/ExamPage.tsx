import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions } from '@/api/exams';
import { getAttemptStatus, saveResponse, submitAttempt } from '@/api/attempts';
import ExamTimer from '@/components/exam/ExamTimer';
import QuestionCard from '@/components/exam/QuestionCard';
import QuestionPalette from '@/components/exam/QuestionPalette';
import SubmitModal from '@/components/exam/SubmitModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Menu, X } from 'lucide-react';

interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  subject: string;
  chapter?: string;
}

const ExamPage = () => {
  const { examId, paperId, attemptId } = useParams<{ examId: string; paperId: string; attemptId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const aid = Number(attemptId);

  // Load questions & initial status
  useEffect(() => {
    const load = async () => {
      try {
        const [qRes, sRes] = await Promise.all([
          getQuestions(Number(examId), Number(paperId)),
          getAttemptStatus(aid),
        ]);
        setQuestions(qRes.data);
        setRemainingSeconds(sRes.data.remainingSeconds);
        // Restore answers if any
        if (sRes.data.responses) {
          const restored: Record<number, string | null> = {};
          sRes.data.responses.forEach((r: any) => {
            restored[r.questionId] = r.selectedOption;
          });
          setAnswers(restored);
        }
      } catch {
        toast({ title: 'Failed to load exam', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [examId, paperId, aid]);

  // Mark visited
  useEffect(() => {
    if (questions.length > 0) {
      setVisited(prev => new Set(prev).add(questions[currentIdx]?.id));
    }
  }, [currentIdx, questions]);

  // Anti-cheat
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const syncTimer = useCallback(async () => {
    try {
      const res = await getAttemptStatus(aid);
      const status = res.data.status;
      if (status === 'TIMED_OUT' || status === 'SUBMITTED') {
        toast({ title: "Time's up! Submitting..." });
        setTimeout(() => navigate(`/result/${aid}`), 3000);
        return;
      }
      setRemainingSeconds(res.data.remainingSeconds);
    } catch {}
  }, [aid, navigate, toast]);

  const handleSelect = async (optionKey: string) => {
    const q = questions[currentIdx];
    setAnswers(prev => ({ ...prev, [q.id]: optionKey }));
    try {
      await saveResponse(aid, { questionId: q.id, selectedOption: optionKey });
    } catch {}
  };

  const handleClear = async () => {
    const q = questions[currentIdx];
    setAnswers(prev => ({ ...prev, [q.id]: null }));
    try {
      await saveResponse(aid, { questionId: q.id, selectedOption: null });
    } catch {}
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitAttempt(aid);
      toast({ title: 'Exam submitted!' });
      navigate(`/result/${aid}`);
    } catch {
      toast({ title: 'Submit failed', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading questions..." />;

  const q = questions[currentIdx];
  if (!q) return null;

  const options = [
    { key: 'A', text: q.optionA },
    { key: 'B', text: q.optionB },
    { key: 'C', text: q.optionC },
    { key: 'D', text: q.optionD },
  ];

  const answeredCount = Object.values(answers).filter(v => v != null).length;

  // Get unique subjects for tabs
  const subjects = [...new Set(questions.map(q => q.subject))];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground text-sm">Paper {paperId}</span>
            <div className="hidden sm:flex gap-2">
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    const idx = questions.findIndex(q => q.subject === s);
                    if (idx >= 0) setCurrentIdx(idx);
                  }}
                  className="text-xs px-3 py-1 rounded-full bg-secondary/20 text-secondary font-medium hover:bg-secondary/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <ExamTimer remainingSeconds={remainingSeconds} onSync={syncTimer} />
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {answeredCount} / {questions.length} answered
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs px-4 py-2 rounded-lg border-2 border-destructive text-destructive font-semibold hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Submit
            </button>
            <button className="lg:hidden" onClick={() => setShowPalette(!showPalette)}>
              {showPalette ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Question area */}
        <div className="flex-1 p-6 overflow-auto">
          <QuestionCard
            questionNumber={currentIdx + 1}
            subject={q.subject}
            chapter={q.chapter}
            questionText={q.questionText}
            options={options}
            selectedOption={answers[q.id] ?? null}
            onSelectOption={handleSelect}
            onClear={handleClear}
            onNext={() => setCurrentIdx(i => Math.min(i + 1, questions.length - 1))}
            onPrevious={() => setCurrentIdx(i => Math.max(i - 1, 0))}
            hasPrevious={currentIdx > 0}
            hasNext={currentIdx < questions.length - 1}
          />
        </div>

        {/* Palette — desktop */}
        <div className="hidden lg:block w-80 border-l p-4 overflow-auto">
          <QuestionPalette
            questions={questions}
            answers={answers}
            visitedSet={visited}
            currentIndex={currentIdx}
            onJump={setCurrentIdx}
          />
        </div>
      </div>

      {/* Mobile palette drawer */}
      {showPalette && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-card border-t shadow-xl p-4 max-h-[60vh] overflow-auto rounded-t-2xl">
          <QuestionPalette
            questions={questions}
            answers={answers}
            visitedSet={visited}
            currentIndex={currentIdx}
            onJump={(i) => { setCurrentIdx(i); setShowPalette(false); }}
          />
        </div>
      )}

      {showModal && (
        <SubmitModal
          answeredCount={answeredCount}
          totalCount={questions.length}
          onConfirm={handleSubmit}
          onCancel={() => setShowModal(false)}
          isSubmitting={submitting}
        />
      )}
    </div>
  );
};

export default ExamPage;
