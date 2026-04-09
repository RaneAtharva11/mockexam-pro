import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllExams } from '@/api/exams';
import { startAttempt } from '@/api/attempts';
import { DEMO_MODE, mockExams } from '@/api/mockData';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExamDetailPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (DEMO_MODE) {
      const found = mockExams.find(e => e.examId === Number(examId));
      setExam(found || null);
      setLoading(false);
      return;
    }
    getAllExams()
      .then(res => {
        const found = res.data.find((e: any) => e.examId === Number(examId));
        setExam(found || null);
      })
      .finally(() => setLoading(false));
  }, [examId]);

  const handleStart = async () => {
    setStarting(true);
    setError('');
    try {
      if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 600));
        const firstPaperId = exam.papers?.[0]?.paperId || 1;
        const demoAttemptId = 1001;
        toast({ title: 'Exam started successfully!' });
        navigate(`/exam/${examId}/paper/${firstPaperId}/attempt/${demoAttemptId}`);
        return;
      }
      const res = await startAttempt(Number(examId));
      const attemptId = res.data.attemptId;
      const firstPaperId = exam.papers?.[0]?.paperId || 1;
      toast({ title: 'Exam started successfully!' });
      navigate(`/exam/${examId}/paper/${firstPaperId}/attempt/${attemptId}`);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('You have already attempted this exam.');
      } else {
        setError('Failed to start exam. Try again.');
      }
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <><Navbar /><LoadingSpinner text="Loading exam details..." /></>;
  if (!exam) return <><Navbar /><div className="text-center mt-20 text-muted-foreground">Exam not found</div></>;

  const totalMarks = exam.totalQuestions * exam.correctMarks;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-card rounded-xl border shadow-sm p-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">{exam.examName}</h1>
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            {[
              ['Total Questions', exam.totalQuestions],
              ['Duration', `${exam.durationMinutes} minutes`],
              ['Marking', `+${exam.correctMarks} / ${exam.wrongMarks} / ${exam.unattemptedMarks}`],
              ['Total Marks', totalMarks],
              ['Papers', exam.papers?.map((p: any) => `${p.paperName ?? `Paper ${p.paperNumber ?? p.paper_number ?? ''}`} (${Array.isArray(p.subjects) ? p.subjects.join(', ') : String(p.subjects || '')})`).join(', ') || '-'],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex flex-col">
                <span className="text-muted-foreground text-xs">{label}</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
          <div className="bg-primary/5 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Instructions</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Once you start, the timer cannot be paused.</li>
              <li>You can navigate between questions freely.</li>
              <li>You can change or clear any answer before submitting.</li>
              <li>The exam auto-submits when the timer reaches zero.</li>
              <li>AI explanations for wrong answers are generated after submission.</li>
            </ul>
          </div>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">{error}</div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={handleStart} disabled={starting} className="flex-[2]">
              {starting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Start Exam Now
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamDetailPage;
