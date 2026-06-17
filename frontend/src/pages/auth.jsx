import { useNavigate } from 'react-router-dom';
import { Nav }    from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Card }   from '@/components/card';
import { Button } from '@/components/button';
import { Input }  from '@/components/input';
import { Label }  from '@/components/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { useState } from 'react';
import { api, session } from '@/lib/api';
import { toast } from 'sonner';
import { Mail, Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  const [le, setLe] = useState('');
  const [lp, setLp] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [rn, setRn] = useState('');
  const [re, setRe] = useState('');
  const [rp, setRp] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Forgot password states
  const [fe, setFe] = useState('');
  const [fotp, setFotp] = useState('');
  const [fnp, setFnp] = useState('');
  const [fotpSent, setFotpSent] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const onLogin = async () => {
    if (!le || !lp) return toast.error('Enter email and password');
    setLoginLoading(true);
    try {
      const user = await api.login(le, lp);
      session.save(user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegister = async () => {
    if (!rn || !re || !rp) return toast.error('Fill all fields');
    setRegisterLoading(true);
    try {
      const user = await api.register(rn, re, rp);
      session.save(user);
      toast.success(`Account created — welcome ${user.name.split(' ')[0]}`);
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const sendForgotOtp = async () => {
    if (!fe) return toast.error('Enter your email first');
    try {
      await api.forgotPassword(fe);
      setFotpSent(true);
      toast.success(`OTP sent to ${fe}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onResetPassword = async () => {
    if (!fe || !fotp || !fnp) return toast.error('Fill all fields');
    setForgotLoading(true);
    try {
      await api.resetPassword(fe, fotp, fnp);
      toast.success('Password reset successfully');
      setFe('');
      setFotp('');
      setFnp('');
      setFotpSent(null);
      setActiveTab('login');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <section className="mx-auto max-w-md w-full px-6 py-16">
        <Card className="p-7 shadow-soft">
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-glow">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Welcome to BathEase</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage your bookings</p>
          </div>

          <Tabs defaultValue="login" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
            {activeTab !== 'forgot' && (
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="register">Create account</TabsTrigger>
              </TabsList>
            )}

            {activeTab === 'forgot' && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Reset password</h2>
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-muted-foreground hover:text-primary mt-2"
                >
                  ← Back to Sign in
                </button>
              </div>
            )}

            <TabsContent value="login" className="space-y-3 mt-5">
              <Field icon={<Mail />} label="Email" id="le">
                <Input id="le" value={le} onChange={(e) => setLe(e.target.value)} placeholder="you@example.com" />
              </Field>
              <Field icon={<Lock />} label="Password" id="lp">
                <Input id="lp" type="password" value={lp} onChange={(e) => setLp(e.target.value)}
                  placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && onLogin()} />
              </Field>
              <Button className="w-full" onClick={onLogin} disabled={loginLoading}>
                {loginLoading ? 'Signing in…' : 'Sign in'}
              </Button>
              <button className="text-xs text-muted-foreground hover:text-primary w-full text-center"
                onClick={() => setActiveTab('forgot')}>
                Forgot password?
              </button>
              <p className="text-[11px] text-center text-muted-foreground mt-2">
                Demo: <code>admin@gmail.com / 12345678</code>
              </p>
            </TabsContent>

            <TabsContent value="register" className="space-y-3 mt-5">
              <Field icon={<UserIcon />} label="Name" id="rn">
                <Input id="rn" value={rn} onChange={(e) => setRn(e.target.value)} />
              </Field>
              <Field icon={<Mail />} label="Email" id="re">
                <Input id="re" type="email" value={re} onChange={(e) => setRe(e.target.value)} />
              </Field>
              <Field icon={<Lock />} label="Password" id="rp">
                <Input id="rp" type="password" value={rp} onChange={(e) => setRp(e.target.value)} />
              </Field>
              <Button className="w-full" onClick={onRegister} disabled={registerLoading}>
                {registerLoading ? 'Creating…' : 'Create account'}
              </Button>
            </TabsContent>

            <TabsContent value="forgot" className="space-y-3 mt-5">
              <Field icon={<Mail />} label="Email" id="fe">
                <Input id="fe" type="email" value={fe} onChange={(e) => setFe(e.target.value)} placeholder="you@example.com" />
              </Field>
              <div className="flex gap-2">
                <Input value={fotp} onChange={(e) => setFotp(e.target.value)} placeholder="6-digit OTP" maxLength={6} />
                <Button type="button" variant="outline" onClick={sendForgotOtp} disabled={!fe}>
                  {fotpSent ? 'Resend' : 'Send OTP'}
                </Button>
              </div>
              <Field icon={<Lock />} label="New Password" id="fnp">
                <Input id="fnp" type="password" value={fnp} onChange={(e) => setFnp(e.target.value)} placeholder="••••••••" />
              </Field>
              <Button className="w-full" onClick={onResetPassword} disabled={forgotLoading || !fotpSent}>
                {forgotLoading ? 'Resetting…' : 'Reset password'}
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </section>
      <Footer />
    </div>
  );
}

function Field({ icon, label, id, children }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
        <div className="pl-9">{children}</div>
      </div>
    </div>
  );
}
