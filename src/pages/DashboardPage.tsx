import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExams } from '@/api/exams';
import { DEMO_MODE, mockExams } from '@/api/mockData';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Target } from 'lucide-react';

interface Paper {
  paperId: number;
  paperName: string;
  subjects: string[];
}

interface Exam {
  examId: number;
  examName: string;
  totalQuestions: number;
  durationMinutes: number;
  correctMarks: number;
  wrongMarks: number;
  unattemptedMarks: number;
  papers: Paper[];
}

// Maps backend response fields to frontend interface
const mapExam = (raw: any): Exam => ({
  examId: raw.examId ?? raw.id,
  examName: raw.examName ?? raw.name,
  totalQuestions: raw.totalQuestions ?? raw.total_questions,
  durationMinutes: raw.durationMinutes ?? Math.floor((raw.durationSeconds ?? raw.duration_seconds ?? 0) / 60),
  correctMarks: raw.correctMarks ?? raw.marksCorrect ?? raw.marks_correct ?? 0,
  wrongMarks: raw.wrongMarks ?? raw.marksWrong ?? raw.marks_wrong ?? 0,
  unattemptedMarks: raw.unattemptedMarks ?? raw.marksUnattempted ?? raw.marks_unattempted ?? 0,
  papers: (raw.papers || []).map((p: any) => ({
    paperId: p.paperId ?? p.id,
    paperName: p.paperName ?? `Paper ${p.paperNumber ?? p.paper_number ?? ''}`.trim(),
    subjects: Array.isArray(p.subjects) ? p.subjects : (typeof p.subjects === 'string' ? p.subjects.split(',').map((s: string) => s.trim()) : []),
  })),
});

const accentColors: Record<string, string> = {
  JEE: 'border-l-primary',
  'MHT-CET': 'border-l-secondary',
  BITSAT: 'border-l-success',
  VIT: 'border-l-warning',
};

const DashboardPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (DEMO_MODE) {
      setTimeout(() => { setExams(mockExams as Exam[]); setLoading(false); }, 500);
      return;
    }
    getAllExams()
      .then(res => {
        console.log('Exams API response:', res.data);
        const data = Array.isArray(res.data) ? res.data : (res.data?.exams || res.data?.data || []);
        setExams(data.map(mapExam));
      })
      .catch((err) => {
        console.error('Failed to load exams:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><LoadingSpinner text="Loading exams..." /></>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Exam</h1>
          <p className="text-muted-foreground">Practice with real exam questions, timer, and AI analysis</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map(exam => (
            <div
              key={exam.examId}
              className={`bg-card rounded-xl border shadow-sm p-6 border-l-4 ${accentColors[exam.examName] || 'border-l-primary'} hover:shadow-md transition-shadow`}
            >
              <h2 className="text-xl font-bold text-foreground mb-4">{exam.examName}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                  <FileText className="h-3 w-3" /> {exam.totalQuestions} Questions
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                  <Clock className="h-3 w-3" /> {exam.durationMinutes} Minutes
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                  <Target className="h-3 w-3" /> +{exam.correctMarks} / {exam.wrongMarks} / {exam.unattemptedMarks}
                </span>
              </div>
              {exam.papers && exam.papers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {exam.papers.map(p => (
                    <span key={p.paperId} className="text-xs bg-secondary/20 text-secondary px-2.5 py-1 rounded-lg font-medium">
                      {p.paperName} — {p.subjects.join(', ')}
                    </span>
                  ))}
                </div>
              )}
              <Button className="w-full" onClick={() => navigate(`/exam/${exam.examId}`)}>
                Start Exam
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
