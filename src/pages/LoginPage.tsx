import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { login as loginApi } from '@/api/auth';
import { DEMO_MODE, mockUser } from '@/api/mockData';
import { Eye, EyeOff, GraduationCap, Clock, Sparkles, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 800));
        loginUser({ token: mockUser.token, name: mockUser.name, email: mockUser.email, role: mockUser.role });
        toast({ title: 'Welcome back!', description: 'Logged in successfully (Demo Mode).' });
        navigate('/dashboard');
        return;
      }
      const res = await loginApi({ email, password });
      loginUser({ token: res.data.token, name: res.data.name, email: res.data.email, role: res.data.role });
      toast({ title: 'Welcome back!', description: 'Logged in successfully.' });
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-[60%] gradient-primary text-primary-foreground flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">ExamSphere</span>
        </div>
        <div className="max-w-lg">
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Prepare like it's the real exam.
          </h1>
          <p className="text-lg opacity-80 mb-8">
            Free mock tests for JEE, MHT-CET, BITSAT and VIT with AI-powered analysis.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Clock, label: 'Real exam timer' },
              { icon: Sparkles, label: 'AI explanations' },
              { icon: BarChart3, label: 'Percentile ranking' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm font-medium backdrop-blur-sm">
                <Icon className="h-4 w-4" /> {label}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm opacity-50">© 2026 ExamSphere. All rights reserved.</p>
      </div>

      {/* Right Form */}
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
              🎯 Demo Mode — Click Login with any credentials to explore
            </div>
          )}
          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">Login to continue your preparation</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Login
            </Button>
          </form>
          <p className="text-sm text-center mt-6 text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
