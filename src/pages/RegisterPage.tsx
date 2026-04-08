import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { register as registerApi } from '@/api/auth';
import { DEMO_MODE, mockUser } from '@/api/mockData';
import { Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    if (DEMO_MODE) return true;
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (password.length < 6) errs.password = 'Min 6 characters';
    if (password !== confirmPassword) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 800));
        loginUser({ token: mockUser.token, name: name || mockUser.name, email: email || mockUser.email, role: mockUser.role });
        toast({ title: 'Account created!', description: 'Welcome to ExamSphere (Demo Mode).' });
        navigate('/dashboard');
        return;
      }
      const res = await registerApi({ name, email, password });
      loginUser({ token: res.data.token, name: res.data.name, email: res.data.email, role: res.data.role });
      toast({ title: 'Account created!', description: 'Welcome to ExamSphere.' });
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrors({ email: 'This email is already registered' });
      } else {
        setErrors({ form: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[60%] gradient-primary text-primary-foreground flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">ExamSphere</span>
        </div>
        <div className="max-w-lg">
          <h1 className="text-4xl font-extrabold leading-tight mb-4">Start your journey today.</h1>
          <p className="text-lg opacity-80">Join thousands of students preparing with real exam simulations and AI-powered insights.</p>
        </div>
        <p className="text-sm opacity-50">© 2026 ExamSphere</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ExamSphere</span>
          </div>
          {DEMO_MODE && (
            <div className="bg-primary/10 text-primary text-xs font-medium rounded-lg px-3 py-2 mb-4 text-center">
              🎯 Demo Mode — Click Create Account to explore
            </div>
          )}
          <h2 className="text-2xl font-bold text-foreground mb-1">Create your account</h2>
          <p className="text-muted-foreground text-sm mb-6">Get started with free mock exams</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Confirm Password</label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              {errors.confirm && <p className="text-xs text-destructive mt-1">{errors.confirm}</p>}
            </div>
            {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Account
            </Button>
          </form>
          <p className="text-sm text-center mt-6 text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
