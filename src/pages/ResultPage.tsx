import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResult } from '@/api/results';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle2, XCircle, MinusCircle, Target, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';

const ResultPage = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'unattempted'>('all');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getResult(Number(attemptId));
        setResult(res.data);
      } catch {}
      setLoading(false);
    };
    load();

    // Poll for percentile
    const interval = setInterval(async () => {
      try {
        const res = await getResult(Number(attemptId));
        setResult(res.data);
        if (res.data.percentileReady) clearInterval(interval);
      } catch {}
    }, 60000);
    return () => clearInterval(interval);
  }, [attemptId]);

  if (loading) return <><Navbar /><LoadingSpinner text="Calculating your score..." /></>;
  if (!result) return <><Navbar /><div className="text-center mt-20 text-muted-foreground">Result not found</div></>;

  const { score, totalMarks, correct, wrong, unattempted, percentile, percentileReady, questionResults = [] } = result;
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  // Subject analysis
  const subjectMap: Record<string, { correct: number; wrong: number; unattempted: number }> = {};
  questionResults.forEach((qr: any) => {
    if (!subjectMap[qr.subject]) subjectMap[qr.subject] = { correct: 0, wrong: 0, unattempted: 0 };
    if (qr.result === 'CORRECT') subjectMap[qr.subject].correct++;
    else if (qr.result === 'WRONG') subjectMap[qr.subject].wrong++;
    else subjectMap[qr.subject].unattempted++;
  });
  const chartData = Object.entries(subjectMap).map(([name, data]) => ({ name, ...data }));

  const filtered = questionResults.filter((qr: any) => {
    if (filter === 'correct') return qr.result === 'CORRECT';
    if (filter === 'wrong') return qr.result === 'WRONG';
    if (filter === 'unattempted') return qr.result === 'UNATTEMPTED';
    return true;
  });

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Score Card */}
        <div className="bg-card rounded-xl border shadow-sm p-8 mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">{result.examName} — Result</h1>
          <div className="flex items-baseline justify-center gap-1 mb-4">
            <span className="text-6xl font-extrabold text-primary">{score}</span>
            <span className="text-2xl text-muted-foreground">/ {totalMarks}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 mb-6 max-w-md mx-auto">
            <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${Math.max(0, (score / totalMarks) * 100)}%` }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: CheckCircle2, label: 'Correct', value: correct, cls: 'text-success bg-success/10' },
              { icon: XCircle, label: 'Wrong', value: wrong, cls: 'text-destructive bg-destructive/10' },
              { icon: MinusCircle, label: 'Unattempted', value: unattempted, cls: 'text-muted-foreground bg-muted' },
              { icon: Target, label: 'Accuracy', value: `${accuracy}%`, cls: 'text-primary bg-primary/10' },
            ].map(({ icon: Icon, label, value, cls }) => (
              <div key={label} className={`rounded-xl p-4 ${cls}`}>
                <Icon className="h-6 w-6 mx-auto mb-1" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs font-medium opacity-70">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Percentile */}
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-6">
          {percentileReady ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Your Percentile</p>
              <p className="text-5xl font-extrabold text-secondary">{percentile?.toFixed(2)}</p>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Percentile calculating... Check back after 11:30 PM tonight</p>
            </div>
          )}
        </div>

        {/* Subject Chart */}
        {chartData.length > 0 && (
          <div className="bg-card rounded-xl border shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Subject-wise Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="correct" fill="hsl(142, 72%, 29%)" name="Correct" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wrong" fill="hsl(0, 72%, 51%)" name="Wrong" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unattempted" fill="hsl(215, 16%, 47%)" name="Unattempted" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Question Review */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-foreground">Review All Questions</h2>
            <Button variant="outline" size="sm" onClick={() => navigate(`/result/${attemptId}/explanations`)}>
              <Sparkles className="h-4 w-4 mr-1" /> View AI Explanations
            </Button>
          </div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {(['all', 'correct', 'wrong', 'unattempted'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((qr: any, idx: number) => {
              const isOpen = expanded.has(qr.questionId);
              const icon = qr.result === 'CORRECT' ? <CheckCircle2 className="h-4 w-4 text-success" /> :
                           qr.result === 'WRONG' ? <XCircle className="h-4 w-4 text-destructive" /> :
                           <MinusCircle className="h-4 w-4 text-muted-foreground" />;
              return (
                <div key={qr.questionId} className="border rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleExpand(qr.questionId)}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {icon}
                      <span className="text-sm font-medium text-foreground">Q.{idx + 1}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{qr.subject}</span>
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 border-t">
                      <p className="text-sm mb-3 text-foreground">{qr.questionText}</p>
                      <div className="space-y-2">
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
