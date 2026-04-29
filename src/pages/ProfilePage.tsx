import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { getMyAttempts } from '@/api/attempts';
import { getResult } from '@/api/results';
import { Quote, Trophy, BarChart3, BookOpen } from 'lucide-react';

interface AttemptResult {
  attemptId: number;
  examId: number;
  examName: string;
  paperName?: string;
  paperId?: number;
  score: number;
  totalMarks: number;
  percentile?: number;
  percentileReady?: boolean;
}

const ProfilePage = () => {
  const { userName, userEmail } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<{ q: string; a: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyAttempts();
        const list = Array.isArray(res.data) ? res.data : (res.data?.attempts || []);
        // For each attempt, try fetching the result for full data
        const enriched = await Promise.all(
          list.map(async (a: any) => {
            const attemptId = a.attemptId ?? a.id;
            try {
              const r = await getResult(attemptId);
              const d = r.data;
              return {
                attemptId,
                examId: d.examId ?? a.examId ?? a.exam_id,
                examName: d.examName ?? a.examName ?? a.exam_name ?? 'Exam',
                paperName: d.paperName ?? a.paperName ?? (a.paperNumber ? `Paper ${a.paperNumber}` : undefined),
                paperId: d.paperId ?? a.paperId ?? a.paper_id,
                score: d.score ?? 0,
                totalMarks: d.totalMarks ?? 0,
                percentile: d.percentile,
                percentileReady: d.percentileReady,
              } as AttemptResult;
            } catch {
              return {
                attemptId,
                examId: a.examId ?? a.exam_id,
                examName: a.examName ?? a.exam_name ?? 'Exam',
                paperName: a.paperName ?? (a.paperNumber ? `Paper ${a.paperNumber}` : undefined),
                paperId: a.paperId ?? a.paper_id,
                score: a.score ?? 0,
                totalMarks: a.totalMarks ?? 0,
                percentile: a.percentile,
                percentileReady: a.percentileReady,
              } as AttemptResult;
            }
          })
        );
        setAttempts(enriched);
      } catch (err) {
        console.error('Failed to load attempts:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // ZenQuotes blocks browser CORS — use a CORS proxy
    fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://zenquotes.io/api/random'))
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data[0]) setQuote({ q: data[0].q, a: data[0].a });
      })
      .catch(() => {
        setQuote({ q: 'Success is the sum of small efforts, repeated day in and day out.', a: 'Robert Collier' });
      });
  }, []);

  // Group attempts: highest marks per exam+paper
  const examMap = new Map<string, AttemptResult[]>();
  attempts.forEach(a => {
    const key = `${a.examId}-${a.paperId ?? a.paperName ?? ''}`;
    if (!examMap.has(key)) examMap.set(key, []);
    examMap.get(key)!.push(a);
  });

  const highestMarks = Array.from(examMap.values()).map(group => {
    return group.reduce((best, cur) => (cur.score > best.score ? cur : best), group[0]);
  });

  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  if (loading) return <><Navbar /><LoadingSpinner text="Loading your profile..." /></>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8">Profile Page</h1>

        <div className="bg-muted/50 rounded-2xl border p-6 md:p-8 space-y-5">
          {/* Username header */}
          <div className="bg-card rounded-xl border shadow-sm p-5 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
              {initials}
            </div>
            <div>
              <p className="text-xl font-bold text-foreground underline underline-offset-4">{userName || 'Username'}</p>
              {userEmail && <p className="text-sm text-muted-foreground">{userEmail}</p>}
            </div>
          </div>

          {/* Exams Attempted */}
          <section className="bg-card rounded-xl border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Exams Attempted By Student</h2>
            </div>
            {attempts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No exams attempted yet.</p>
            ) : (
              <ul className="divide-y">
                {attempts.map(a => (
                  <li
                    key={a.attemptId}
                    className="py-2.5 flex items-center justify-between text-sm cursor-pointer hover:bg-accent/40 px-2 rounded-md transition-colors"
                    onClick={() => navigate(`/result/${a.attemptId}`)}
                  >
                    <span className="font-medium text-foreground">
                      {a.examName}{a.paperName ? ` — ${a.paperName}` : ''}
                    </span>
                    <span className="text-xs text-muted-foreground">View result →</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Highest Marks */}
          <section className="bg-card rounded-xl border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-warning" />
              <h2 className="text-base font-semibold text-foreground">Highest Marks Scored By Student (Paper wise)</h2>
            </div>
            {highestMarks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No scores yet.</p>
            ) : (
              <ul className="space-y-2">
                {highestMarks.map(a => (
                  <li key={a.attemptId} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-muted/40">
                    <span className="font-medium text-foreground">
                      {a.examName}{a.paperName ? ` — ${a.paperName}` : ''}
                    </span>
                    <span className="font-bold text-primary">
                      {a.score} / {a.totalMarks}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Percentile */}
          <section className="bg-card rounded-xl border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-secondary" />
              <h2 className="text-base font-semibold text-foreground">Percentile Scored in Each Paper</h2>
            </div>
            {highestMarks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No percentile data yet.</p>
            ) : (
              <ul className="space-y-2">
                {highestMarks.map(a => (
                  <li key={a.attemptId} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-muted/40">
                    <span className="font-medium text-foreground">
                      {a.examName}{a.paperName ? ` — ${a.paperName}` : ''}
                    </span>
                    <span className="font-bold text-secondary">
                      {a.percentileReady && a.percentile != null
                        ? `${a.percentile.toFixed(2)} %ile`
                        : 'Calculating...'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Random Quote */}
          <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-card rounded-xl border shadow-sm p-6 relative overflow-hidden">
            <Quote className="absolute top-3 right-3 h-10 w-10 text-primary/20" />
            <div className="flex items-center gap-2 mb-3">
              <Quote className="h-4 w-4 text-primary" />
              <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Thought of the moment</h2>
            </div>
            {quote ? (
              <blockquote className="space-y-2">
                <p className="font-serif italic text-lg md:text-xl leading-relaxed text-foreground">
                  “{quote.q}”
                </p>
                <footer className="text-sm font-medium text-muted-foreground">— {quote.a}</footer>
              </blockquote>
            ) : (
              <p className="text-sm text-muted-foreground">Fetching inspiration...</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
