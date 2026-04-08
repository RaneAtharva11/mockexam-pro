import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResult } from '@/api/results';
import { getExplanations } from '@/api/results';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Sparkles, XCircle, MinusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExplanationPage = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [explanationsMap, setExplanationsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const load = async () => {
      try {
        const [resResult, resExp] = await Promise.all([
          getResult(Number(attemptId)),
          getExplanations(Number(attemptId)),
        ]);
        setResult(resResult.data);
        setExplanationsMap(resExp.data || {});
      } catch {}
      setLoading(false);
    };
    load();
  }, [attemptId]);

  // Poll for pending explanations
  useEffect(() => {
    if (!result) return;
    const wrongOrUnattempted = (result.questionResults || []).filter(
      (qr: any) => qr.result === 'WRONG' || qr.result === 'UNATTEMPTED'
    );

    const checkPending = () => {
      const pending = wrongOrUnattempted.filter(
        (qr: any) => !explanationsMap[qr.responseId] || explanationsMap[qr.responseId] === 'Explanation not yet available.'
      );
      return pending.length > 0;
    };

    if (checkPending()) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await getExplanations(Number(attemptId));
          setExplanationsMap(res.data || {});
        } catch {}
      }, 10000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [result, explanationsMap, attemptId]);

  if (loading) return <><Navbar /><LoadingSpinner text="Loading explanations..." /></>;
  if (!result) return <><Navbar /><div className="text-center mt-20 text-muted-foreground">Not found</div></>;

  const wrongOrUnattempted = (result.questionResults || []).filter(
    (qr: any) => qr.result === 'WRONG' || qr.result === 'UNATTEMPTED'
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(`/result/${attemptId}`)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Results
        </Button>
        <h1 className="text-2xl font-bold text-foreground mb-1">AI Explanations</h1>
        <p className="text-muted-foreground text-sm mb-6">Understand every mistake to improve your score</p>

        <div className="space-y-6">
          {wrongOrUnattempted.map((qr: any, idx: number) => {
            const isWrong = qr.result === 'WRONG';
            const explanation = explanationsMap[qr.responseId];
            const isPending = !explanation || explanation === 'Explanation not yet available.';

            return (
              <div key={qr.questionId} className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
                  <span className="text-sm font-bold text-foreground">Q.{idx + 1}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">{qr.subject}</span>
                  {isWrong ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                      <XCircle className="h-3 w-3" /> Wrong
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      <MinusCircle className="h-3 w-3" /> Unattempted
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-foreground mb-4">{qr.questionText}</p>
                  <div className="space-y-2 mb-4">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const text = qr[`option${opt}`];
                      const isCorrect = qr.correctOption === opt;
                      const isStudentChoice = qr.selectedOption === opt;
                      let cls = 'bg-muted/50';
                      if (isCorrect) cls = 'bg-success/10 border-success';
                      else if (isStudentChoice && !isCorrect) cls = 'bg-destructive/10 border-destructive';
                      return (
                        <div key={opt} className={`text-sm p-3 rounded-lg border ${cls}`}>
                          <span className="font-semibold mr-2">{opt}.</span>{text}
                        </div>
                      );
                    })}
                  </div>
                  {/* AI Explanation */}
                  <div className="border-l-4 border-secondary rounded-r-lg bg-secondary/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-semibold text-secondary">AI Explanation</span>
                    </div>
                    {isPending ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Generating explanation...
                      </div>
                    ) : (
                      <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {wrongOrUnattempted.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              🎉 All answers correct! No explanations needed.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExplanationPage;
