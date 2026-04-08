import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface SubmitModalProps {
  answeredCount: number;
  totalCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const SubmitModal = ({ answeredCount, totalCount, onConfirm, onCancel, isSubmitting }: SubmitModalProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
    <div className="bg-card rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Submit Exam?</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-1">Are you sure you want to submit?</p>
      <p className="text-sm mb-6">
        <span className="font-semibold text-success">Answered: {answeredCount}</span>
        {' • '}
        <span className="font-semibold text-destructive">Unanswered: {totalCount - answeredCount}</span>
      </p>
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
        </Button>
      </div>
    </div>
  </div>
);

export default SubmitModal;
