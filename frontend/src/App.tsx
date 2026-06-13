import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Copy,
  Check,
  MessageSquare,
  Shield,
  Settings,
  QrCode,
  Printer,
  Download,
  Sparkles,
  AlertCircle,
  ThumbsUp,
  Languages,
  Send,
  Loader2,
  RefreshCw,
  ExternalLink,
  Lock,
  Users,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const GoogleLogoSvg = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);


interface AuthUser {
  _id: string;
  email: string;
  role: 'admin' | 'merchant';
  businessId?: string;
}

interface LoginPageProps {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  showToast: (msg: string) => void;
  user: AuthUser | null;
  navigateTo: (path: string) => void;
}

function LoginPage({ login, showToast, user, navigateTo }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigateTo(user.role === 'admin' ? '/super-admin' : '/admin');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      showToast(result.error || 'Invalid email or password.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={28} color="var(--accent)" />
            <h1 style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em' }}><span style={{ color: 'var(--accent)' }}>Review Our</span> Business</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-accent" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? <><Loader2 size={16} className="spinner" /> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Are you a merchant? <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigateTo('/register')}>Register here</span>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MERCHANT REGISTRATION PAGE
// ==========================================
interface RegisterPageProps {
  showToast: (msg: string) => void;
  navigateTo: (path: string) => void;
}

function RegisterPage({ showToast, navigateTo }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '', category: 'Restaurant', context: '', googleReviewUrl: '',
    location: '', mobileNumber: '', email: '', password: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMobileChange = (value: string) => {
    let digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length > 5) {
      digits = `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    handleChange('mobileNumber', digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register-merchant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        showToast(data.error || 'Registration failed.');
      }
    } catch {
      showToast('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
        <div className="card fade-in" style={{ width: '100%', maxWidth: '480px', padding: '3rem', textAlign: 'center' }}>
          <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Registration Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Your business registration has been submitted successfully. Our admin team will review your details and approve your account shortly. You will receive login credentials once approved.
          </p>
          <button className="btn btn-accent" onClick={() => navigateTo('/login')}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={28} color="var(--accent)" />
            <h1 style={{ fontWeight: 700, fontSize: '1.5rem' }}><span style={{ color: 'var(--accent)' }}>Review Our</span> Business</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Register your business</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input type="text" className="form-input" value={formData.name} onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Luigi's Pizza Palace" required />
          </div>

          <div className="form-group">
            <label className="form-label">Business Category</label>
            <select className="form-select" value={formData.category} onChange={(e) => handleChange('category', e.target.value)}>
              <option value="Restaurant">Restaurant / Cafe</option>
              <option value="Medical Clinic">Dental / Medical Clinic</option>
              <option value="Auto Repair">Car Mechanic / Auto Repair</option>
              <option value="Retail Store">Retail Shop / Boutique</option>
              <option value="Hair Salon">Hair Salon / Spa</option>
              <option value="Hotel">Hotel / Guesthouse</option>
              <option value="Professional Services">Lawyer / Accountant / Agency</option>
              <option value="Other">Other Service Business</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Business Location</label>
            <input type="text" className="form-input" value={formData.location} onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. 123 Main St, Mumbai, India" />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input type="tel" name="tel" autoComplete="tel" className="form-input" value={formData.mobileNumber}
              onChange={(e) => handleMobileChange(e.target.value)}
              placeholder="XXXXX XXXXX" />
          </div>

          <div className="form-group">
            <label className="form-label">Google Review URL</label>
            <input type="url" className="form-input" value={formData.googleReviewUrl} onChange={(e) => handleChange('googleReviewUrl', e.target.value)}
              placeholder="https://g.page/r/YOUR_BUSINESS_ID/review" />
          </div>

          <div className="form-group">
            <label className="form-label">About Your Business (AI Context)</label>
            <textarea className="form-textarea" value={formData.context} onChange={(e) => handleChange('context', e.target.value)}
              placeholder="Tell AI about your business so it can generate relevant reviews..." />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>ACCOUNT CREDENTIALS</p>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={formData.email} onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@business.com" required autoComplete="email" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={formData.password} onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Min 6 characters" required minLength={6} autoComplete="new-password" />
          </div>

          <button type="submit" className="btn btn-accent" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? <><Loader2 size={16} className="spinner" /> Submitting...</> : 'Submit Registration'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Already have an account? <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigateTo('/login')}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

// Custom lightweight routing
const getRouteInfo = () => {
  const path = window.location.pathname;
  if (path === '/login') {
    return { view: 'login', businessId: '' };
  }
  if (path === '/register') {
    return { view: 'register', businessId: '' };
  }
  if (path.startsWith('/review/')) {
    const parts = path.split('/');
    return { view: 'review', businessId: parts[2] || '' };
  }
  if (path === '/super-admin') {
    return { view: 'super-admin', businessId: '' };
  }
  return { view: 'admin', businessId: '' };
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export default function App() {
  const [route, setRoute] = useState(getRouteInfo());
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include', headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        if (res.status === 403) {
          try {
            const data = await res.json();
            showToast(data.error || 'Account has been suspended. Contact administrator.');
          } catch {
            showToast('Account has been suspended. Contact administrator.');
          }
        }
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) localStorage.setItem('auth_token', data.token);
        setUser(data);
        if (data.role === 'admin') {
          navigateTo('/super-admin');
        } else {
          navigateTo('/admin');
        }
        return { success: true };
      }
      const data = await res.json();
      return { success: false, error: data.error || 'Invalid email or password.' };
    } catch {
      return { success: false, error: 'Could not connect to server.' };
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include', headers: getAuthHeaders() });
    localStorage.removeItem('auth_token');
    setUser(null);
    navigateTo('/login');
  };

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: '', show: false });
    }, 3000);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(getRouteInfo());
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(getRouteInfo());
  };

  // Auth gate: redirect to login if not authenticated (except review, login, and register pages)
  if (authLoading && route.view !== 'review' && route.view !== 'login' && route.view !== 'register') {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={36} className="spinner" color="var(--accent)" />
      </div>
    );
  }

  if (!authLoading && !user && route.view !== 'review' && route.view !== 'login' && route.view !== 'register') {
    navigateTo('/login');
    return null;
  }

  // Admin can only access super-admin, merchant can only access admin
  if (user && route.view === 'super-admin' && user.role !== 'admin') {
    navigateTo('/admin');
    return null;
  }

  return (
    <div className="app-container">
      {toast.show && (
        <div className="toast">
          <Check size={18} />
          <span>{toast.message}</span>
        </div>
      )}

      {route.view === 'login' ? (
        <LoginPage login={login} showToast={showToast} user={user} navigateTo={navigateTo} />
      ) : route.view === 'register' ? (
        <RegisterPage showToast={showToast} navigateTo={navigateTo} />
      ) : route.view === 'super-admin' ? (
        <SuperAdminDashboard showToast={showToast} navigateTo={navigateTo} user={user!} logout={logout} />
      ) : route.view === 'admin' ? (
        <AdminDashboard showToast={showToast} navigateTo={navigateTo} user={user!} logout={logout} />
      ) : (
        <CustomerReviewView businessId={route.businessId} showToast={showToast} navigateTo={navigateTo} />
      )}
    </div>
  );
}

// ==========================================
// 1. MERCHANT/ADMIN DASHBOARD VIEW
// ==========================================
interface AdminDashboardProps {
  showToast: (msg: string) => void;
  navigateTo: (path: string) => void;
  user: AuthUser;
  logout: () => void;
}

function AdminDashboard({ showToast, navigateTo, user, logout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'qr' | 'feedbacks' | 'analytics' | 'reports'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [businessId, setBusinessId] = useState<string>(() => localStorage.getItem('review_biz_id') || '');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Restaurant');
  const [context, setContext] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [qrColor, setQrColor] = useState('#6C63FF');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [logoUrl, setLogoUrl] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024) {
      showToast('Image size exceeds 100KB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
  };

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [scansToday, setScansToday] = useState(0);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState<'verified' | 'unverified' | 'all'>('verified');

  const [googleRefreshToken, setGoogleRefreshToken] = useState('');
  const [googleAccountId, setGoogleAccountId] = useState('');
  const [googleLocationId, setGoogleLocationId] = useState('');
  const [googleLocationName, setGoogleLocationName] = useState('');
  const [googleLocations, setGoogleLocations] = useState<any[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [syncingReviews, setSyncingReviews] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails(businessId);
      fetchFeedbacks(businessId);
    }
  }, [businessId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('google_oauth_success') === 'true') {
      showToast('Google Account connected successfully!');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      setActiveTab('profile');
    }
  }, []);

  const fetchBusinessDetails = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/business/${id}`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setName(data.name);
        setCategory(data.category);
        setContext(data.context);
        setGoogleReviewUrl(data.googleReviewUrl);
        setKeywords(Array.isArray(data.keywords) ? data.keywords.join(', ') : '');
        setIsApproved(data.isApproved);
        if (data.qrColor) setQrColor(data.qrColor);
        if (data.qrBgColor) setQrBgColor(data.qrBgColor);
        setLogoUrl(data.logoUrl || '');
        setGoogleRefreshToken(data.googleRefreshToken || '');
        setGoogleAccountId(data.googleAccountId || '');
        setGoogleLocationId(data.googleLocationId || '');
        setGoogleLocationName(data.googleLocationName || '');
      }
    } catch (err) {
      console.error('Could not fetch business details from server, using demo state.', err);
    }
  };

  const fetchFeedbacks = async (id: string, runSync = true) => {
    setLoadingFeedbacks(true);
    try {
      if (runSync) {
        try {
          await fetch(`${API_BASE}/business/${id}/google/sync-reviews`, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include'
          });
        } catch (err) {
          console.error('Error auto-syncing Google reviews:', err);
        }
      }

      const response = await fetch(`${API_BASE}/business/${id}/feedbacks`, { credentials: 'include', headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedbacks || []);
        setScansToday(data.scansToday || 0);
      }
    } catch (err) {
      console.error('Could not fetch feedbacks from server.', err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const fetchGoogleLocations = async () => {
    if (!businessId) return;
    setLoadingLocations(true);
    try {
      const res = await fetch(`${API_BASE}/business/${businessId}/google/locations`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setGoogleLocations(data.locations || []);
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to fetch Google locations.');
      }
    } catch {
      showToast('Failed to connect to server.');
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleSelectLocation = async (loc: { googleAccountId: string; googleLocationId: string; googleLocationName: string }) => {
    if (!businessId) return;
    try {
      const res = await fetch(`${API_BASE}/business/${businessId}/google/select-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(loc)
      });
      if (res.ok) {
        const data = await res.json();
        setGoogleAccountId(data.googleAccountId || '');
        setGoogleLocationId(data.googleLocationId || '');
        setGoogleLocationName(data.googleLocationName || '');
        showToast(`Connected to location: ${data.googleLocationName}`);
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to save location.');
      }
    } catch {
      showToast('Failed to connect to server.');
    }
  };

  const handleDisconnectGoogle = async () => {
    if (!window.confirm('Are you sure you want to disconnect Google Business Profile?')) return;
    if (!businessId) return;
    try {
      const res = await fetch(`${API_BASE}/business/${businessId}/google/disconnect`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        setGoogleRefreshToken('');
        setGoogleAccountId('');
        setGoogleLocationId('');
        setGoogleLocationName('');
        setGoogleLocations([]);
        showToast('Google Account disconnected.');
      } else {
        showToast('Failed to disconnect Google Account.');
      }
    } catch {
      showToast('Failed to connect to server.');
    }
  };

  const handleSyncReviews = async () => {
    if (!businessId) return;
    setSyncingReviews(true);
    try {
      const res = await fetch(`${API_BASE}/business/${businessId}/google/sync-reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Sync completed! Verified ${data.verifiedCount} reviews.`);
        fetchFeedbacks(businessId, false);
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to sync Google reviews.');
      }
    } catch {
      showToast('Failed to connect to server.');
    } finally {
      setSyncingReviews(false);
    }
  };


  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        id: businessId || undefined,
        name,
        category,
        context,
        googleReviewUrl,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
        logoUrl
      };

      const response = await fetch(`${API_BASE}/business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setBusinessId(data._id);
        localStorage.setItem('review_biz_id', data._id);
        showToast('Business details saved successfully!');
        setActiveTab('qr');
      } else {
        showToast('Error saving business context.');
      }
    } catch (err) {
      console.error('Failed to connect to API server. Saving locally as demo.', err);
      // Fallback local storage mock
      const mockId = businessId || 'demo_biz_12345';
      setBusinessId(mockId);
      localStorage.setItem('review_biz_id', mockId);
      localStorage.setItem(`demo_biz_${mockId}`, JSON.stringify({ name, category, context, googleReviewUrl, logoUrl }));
      showToast('Backend offline. Saved as Local Demo!');
      setActiveTab('qr');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to generate full customer review link
  const getCustomerLink = () => {
    const id = businessId || 'demo_biz_12345';
    return `${window.location.origin}/review/${id}`;
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${name.replace(/\s+/g, '_')}_google_review_qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        showToast('QR Code download started!');
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printFlyer = () => {
    window.print();
  };

  const saveQrSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/business/${businessId}/qr-settings`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include',
        body: JSON.stringify({ qrColor, qrBgColor })
      });
      if (res.ok) showToast('QR settings saved!');
    } catch { showToast('Could not save QR settings.'); }
  };

  const exportFeedbacksCSV = () => {
    if (!businessId) return;
    window.open(`${API_BASE}/business/${businessId}/feedbacks/csv`, '_blank');
  };

  const exportContactsCSV = () => {
    if (!businessId) return;
    window.open(`${API_BASE}/business/${businessId}/contacts/csv`, '_blank');
  };

  return (
    <div className="fade-in">
      {/* Printable Flyer Elements */}
      <div className="qr-flyer-print" style={{ display: 'none' }}>
        {/* Previous design commented out as requested
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          border: `2px solid ${qrColor || '#6C63FF'}`,
          borderRadius: '20px',
          padding: '2.5rem 1.5rem',
          boxSizing: 'border-box',
          textAlign: 'center',
          position: 'relative',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
            ) : (
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} color={qrColor || '#6C63FF'} />
              </div>
            )}
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', textTransform: 'capitalize', lineHeight: 1.2 }}>
              {name || 'Our Business'}
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: qrColor || '#6C63FF',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: `${qrColor}15` || '#6c63ff15',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              display: 'inline-block'
            }}>
              Review us on Google
            </span>
            <div style={{
              padding: '1.25rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <QRCodeSVG
                value={getCustomerLink()}
                size={180}
                level="H"
                fgColor={qrColor}
                bgColor={qrBgColor}
                imageSettings={logoUrl ? { src: logoUrl, height: 36, width: 36, excavate: true } : undefined}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <span style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: qrColor || '#6C63FF',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textAlign: 'center'
            }}>
              Powered by Shivam Nextgen
            </span>
          </div>
        </div>
        */}

        {/* New Standee Design */}
        <div className="dots"></div>
        <div className="diamonds left">
          <div className="diamond"></div>
          <div className="diamond"></div>
          <div className="diamond"></div>
        </div>
        <div className="diamonds right">
          <div className="diamond"></div>
          <div className="diamond"></div>
          <div className="diamond"></div>
        </div>

        {logoUrl ? (
          <img className="top-logo" src={logoUrl} alt="Logo" />
        ) : (
          <svg className="top-logo" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M25.5 12C23.0145 12 20.916 13.4355 19.827 15.534C19.1685 14.2695 17.8425 13.5 16.5 13.5C14.0145 13.5 12 15.5145 12 18C12 20.4855 14.0145 22.5 16.5 22.5C17.8425 22.5 19.1685 21.7305 19.827 20.466C20.916 22.5645 23.0145 24 25.5 24C28.8135 24 31.5 21.3135 31.5 18C31.5 14.6865 28.8135 12 25.5 12ZM16.5 20.25C15.258 20.25 14.25 19.242 14.25 18C14.25 16.758 15.258 15.75 16.5 15.75C17.742 15.75 18.75 16.758 18.75 18C18.75 19.242 17.742 20.25 16.5 20.25ZM25.5 21.75C23.43 21.75 21.75 20.07 21.75 18C21.75 15.93 23.43 14.25 25.5 14.25C27.57 14.25 29.25 15.93 29.25 18C29.25 20.07 27.57 21.75 25.5 21.75Z"
              fill="#0064E0"
            />
          </svg>
        )}

        <h1 className="title">{name || 'Our Business'}</h1>
        <div className="divider"></div>
        <p className="subtitle">REVIEW US ON GOOGLE</p>

        <div className="qr-wrapper">
          <QRCodeSVG
            value={getCustomerLink()}
            size={220}
            level="H"
            fgColor={qrColor || '#000000'}
            bgColor={qrBgColor || '#ffffff'}
          />
        </div>

        <p className="footer-text">
          POWERED BY<br />
          <span style={{ color: '#d4af37', fontSize: '20px', fontWeight: 700, display: 'block', marginTop: '3px', letterSpacing: '2px' }}>
            SHIVAM NEXTGEN
          </span>
        </p>
      </div>

      <div className="merchant-layout">
        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="mobile-header-logo" onClick={() => navigateTo('/admin')}>
            <Sparkles size={20} />
            <span>Review Our</span> Business
          </div>
          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Backdrop for mobile drawer */}
        {isMobileMenuOpen && <div className="sidebar-backdrop" onClick={() => setIsMobileMenuOpen(false)} />}

        {/* Sidebar */}
        <aside className={`merchant-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-logo" onClick={() => { navigateTo('/admin'); setIsMobileMenuOpen(false); }}>
            <Sparkles size={22} />
            <span>Review Our</span> Business
          </div>
          <div className="sidebar-header">
            <h3>{name || 'Your Business'}</h3>
            <p>{category}</p>
          </div>
          <nav className="sidebar-nav">
            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}>
              <Sparkles size={16} /> Overview
            </button>
            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }}>
              <Settings size={16} /> Business Profile
            </button>
            <button className={activeTab === 'qr' ? 'active' : ''} onClick={() => { setActiveTab('qr'); setIsMobileMenuOpen(false); }}>
              <QrCode size={16} /> Review QR Code
            </button>
            <button className={activeTab === 'feedbacks' ? 'active' : ''} onClick={() => { setActiveTab('feedbacks'); setIsMobileMenuOpen(false); }}>
              <MessageSquare size={16} /> Customer Reviews
            </button>
            <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }}>
              <BarChart3 size={16} /> Analytics
            </button>
            <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}>
              <Download size={16} /> Reports
            </button>
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-stat">
              <span className="sidebar-stat-label"><QrCode size={14} /> Scans Today</span>
              <span className="sidebar-stat-value">{scansToday}</span>
            </div>
            <div className="sidebar-stat">
              <span className="sidebar-stat-label"><MessageSquare size={14} /> Reviews</span>
              <span className="sidebar-stat-value">{feedbacks.length}</span>
            </div>
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
              <button className="btn btn-outline btn-sm" onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ width: '100%', fontSize: '0.8125rem' }}>
                <Lock size={14} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="merchant-content">
          {activeTab === 'overview' && (
            <div className="card fade-in">
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="var(--accent)" /> Dashboard Overview
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                  <QrCode size={28} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase' }}>Scans Today</p>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem' }}>{scansToday}</h2>
                </div>
                <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                  <MessageSquare size={28} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase' }}>Total Reviews</p>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem' }}>{feedbacks.length}</h2>
                </div>
                <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', border: `1px solid ${isApproved ? 'var(--success)' : 'var(--warning)'}`, textAlign: 'center' }}>
                  <Shield size={28} color={isApproved ? 'var(--success)' : 'var(--warning)'} style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase' }}>Status</p>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: isApproved ? 'var(--success)' : 'var(--warning)' }}>
                    {isApproved ? 'Approved' : 'Pending'}
                  </h2>
                </div>
              </div>

              {feedbacks.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Recent Reviews</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {feedbacks.slice(0, 3).map((fb) => (
                      <div key={fb._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className={`rating-badge ${fb.rating <= 2 ? 'low' : fb.rating <= 3 ? 'mid' : 'high'}`}>
                              <Star size={10} style={{ fill: 'currentColor' }} /> {fb.rating}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                              {new Date(fb.createdAt).toLocaleDateString()} {new Date(fb.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {fb.isVerifiedOnGoogle && (
                              <span style={{ color: 'var(--success)', backgroundColor: 'var(--success-light)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Check size={10} strokeWidth={3} /> Verified on Google
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{fb.feedbackText}</p>
                          {fb.customerContact && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                              Contact: {fb.customerContact}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {feedbacks.length > 3 && (
                    <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('feedbacks')} style={{ marginTop: '1rem', fontSize: '0.8125rem' }}>
                      View all {feedbacks.length} reviews
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="card fade-in">
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={20} color="var(--accent)" /> Configure Business Settings
                </h2>
                <form onSubmit={handleSaveProfile}>
                  <div className="form-grid-2-section">
                    {/* Left Section: Profile Details */}
                    <div>
                      <div className="form-group">
                        <label className="form-label">Business Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Luigi's Pizza Palace"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Business Category</label>
                        <select
                          className="form-select"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="Restaurant">Restaurant / Cafe</option>
                          <option value="Medical Clinic">Dental / Medical Clinic</option>
                          <option value="Auto Repair">Car Mechanic / Auto Repair</option>
                          <option value="Retail Store">Retail Shop / Boutique</option>
                          <option value="Hair Salon">Hair Salon / Spa</option>
                          <option value="Hotel">Hotel / Guesthouse</option>
                          <option value="Professional Services">Lawyer / Accountant / Agency</option>
                          <option value="Other">Other Service Business</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Google Review URL</label>
                        <input
                          type="url"
                          className="form-input"
                          value={googleReviewUrl}
                          onChange={(e) => setGoogleReviewUrl(e.target.value)}
                          placeholder="https://g.page/r/YOUR_BUSINESS_ID/review"
                          required
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          Tip: Get this link from your Google Business Profile manager under "Ask for reviews".
                        </p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">SEO Keywords (Optional)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          placeholder="e.g. best pizza in town, fresh ingredients, family friendly, affordable prices"
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          Comma-separated keywords the AI will naturally weave into reviews for better Google search visibility.
                        </p>
                      </div>
                    </div>

                    {/* Right Section: AI Context & Logo */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div className="form-group">
                          <label className="form-label">AI Prompt Context (Tell AI about your business)</label>
                          <textarea
                            className="form-textarea"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            style={{ height: '140px' }}
                            placeholder="Provide context like: Cozy Italian pizza shop famous for wood-fired pepperoni pizza, friendly service, and a beautiful outdoor patio. We want reviews to focus on friendly staff, fast service, and fresh ingredients."
                            required
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                          <label className="form-label">Business Logo</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                            {logoUrl ? (
                              <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={logoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                              </div>
                            ) : (
                              <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                                <span>No Logo</span>
                              </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', margin: 0, width: 'fit-content' }}>
                                <span>Choose File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleLogoUpload}
                                  style={{ display: 'none' }}
                                />
                              </label>
                              {logoUrl && (
                                <button type="button" className="btn btn-outline btn-sm" onClick={handleRemoveLogo} style={{ color: 'var(--danger)', borderColor: 'var(--border-light)', width: 'fit-content' }}>
                                  Remove Logo
                                </button>
                              )}
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                                Max size 100KB. Squared image is recommended for best QR scannability.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-accent" disabled={isSubmitting} style={{ width: '100%', marginTop: 'auto' }}>
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                            Saving details...
                          </>
                        ) : 'Save & Generate Review QR'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Google Business Profile Integration Card */}
              <div className="card fade-in">
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GoogleLogoSvg /> Google Business Profile Integration
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  Connect your Google Business Profile to sync official Google reviews. When connected, our system matches local review logs with real Google reviews to verify authenticity and display a green "Verified" checkmark.
                </p>

                {!googleRefreshToken ? (
                  <div style={{ padding: '2rem 1.5rem', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                      <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', display: 'inline-flex' }}>
                        <GoogleLogoSvg />
                      </div>
                    </div>
                    <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Google Account Disconnected</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                      Link your Google account to authorize retrieval of locations and customer reviews.
                    </p>
                    <a
                      href={`${API_BASE}/auth/google?businessId=${businessId}`}
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', borderColor: '#dadce0', fontWeight: 600 }}
                    >
                      <GoogleLogoSvg /> Connect Google Account
                    </a>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', marginBottom: '1.5rem' }}>
                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <h4 style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                          <CheckCircle size={16} /> Google Account Connected
                        </h4>

                        {googleLocationId ? (
                          <div style={{ marginTop: '0.75rem' }}>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Linked Location:</p>
                            <p style={{ fontSize: '0.9375rem', fontWeight: 700, marginTop: '0.15rem' }}>{googleLocationName}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>Location: {googleLocationId.split('/').pop()} | Account: {googleAccountId.split('/').pop()}</p>
                          </div>
                        ) : (
                          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--warning-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>Location Selection Required</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Please select a business location below to sync reviews from.</p>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', minWidth: '150px' }}>
                        {googleLocationId && (
                          <button
                            className="btn btn-accent btn-sm"
                            onClick={handleSyncReviews}
                            disabled={syncingReviews}
                            style={{ width: '100%', fontSize: '0.8125rem' }}
                          >
                            <RefreshCw size={14} className={syncingReviews ? 'spinner' : ''} /> {syncingReviews ? 'Syncing...' : 'Sync Reviews Now'}
                          </button>
                        )}
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={handleDisconnectGoogle}
                          style={{ width: '100%', fontSize: '0.8125rem', color: 'var(--danger)', borderColor: 'var(--border-light)' }}
                        >
                          Disconnect Account
                        </button>
                      </div>
                    </div>

                    {(!googleLocationId || googleLocations.length > 0) && (
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>Select Business Location</h4>

                        {googleLocations.length === 0 ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={fetchGoogleLocations}
                            disabled={loadingLocations}
                          >
                            {loadingLocations ? <><Loader2 size={14} className="spinner" /> Fetching Locations...</> : 'Fetch Locations'}
                          </button>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '450px' }}>
                            <select
                              className="form-select"
                              defaultValue=""
                              onChange={(e) => {
                                const val = e.target.value;
                                if (!val) return;
                                const loc = googleLocations.find(l => l.googleLocationId === val);
                                if (loc) handleSelectLocation(loc);
                              }}
                            >
                              <option value="" disabled>-- Select a Location --</option>
                              {googleLocations.map((loc) => (
                                <option key={loc.googleLocationId} value={loc.googleLocationId}>
                                  {loc.googleLocationName} ({loc.address || 'No address'})
                                </option>
                              ))}
                            </select>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              Don't see your location? Make sure it's verified in your Google Business Profile Console.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="card fade-in">
                <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <QrCode size={20} color="var(--accent)" /> Review QR Code Flyer
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  Print this flyer and display it at your checkout, counter, or tables. Customers scan it to quickly draft and post five-star Google reviews.
                </p>

                <div className="qr-preview-container">
                  <div className="qr-box" ref={qrRef}>
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={getCustomerLink()}
                      size={200}
                      level="H"
                      fgColor={qrColor}
                      bgColor={qrBgColor}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Scan to leave a review</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{getCustomerLink()}</p>
                  </div>
                </div>
              </div>

              <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                <h3>Actions</h3>
                <button className="btn btn-secondary btn-print" onClick={printFlyer}>
                  <Printer size={16} /> Print Review Flyer
                </button>
                <button className="btn btn-primary" onClick={downloadQR}>
                  <Download size={16} /> Download QR Image (PNG)
                </button>
                <button className="btn btn-outline" onClick={() => window.open(getCustomerLink(), '_blank')}>
                  <ExternalLink size={16} /> Open Customer View
                </button>

                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>QR Code Branding</h4>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Foreground Color</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)}
                          style={{ width: '32px', height: '32px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }} />
                        <input type="text" className="form-input" value={qrColor} onChange={(e) => setQrColor(e.target.value)}
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', flex: 1 }} />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Background Color</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)}
                          style={{ width: '32px', height: '32px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }} />
                        <input type="text" className="form-input" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)}
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', flex: 1 }} />
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-accent btn-sm" onClick={saveQrSettings} style={{ width: '100%' }}>Save Branding</button>
                </div>

                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <AlertCircle size={16} /> How it works
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    This flyer redirects customers to our review gateway. Satisfied users get smart AI review suggestions in multiple languages, while customers with feedback are routed internally to protect your Google Rating.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedbacks' && (
            <div className="card fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={20} color="var(--accent)" /> Customer Reviews
                </h2>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => businessId && fetchFeedbacks(businessId)}
                  disabled={loadingFeedbacks}
                >
                  <RefreshCw size={14} className={loadingFeedbacks ? 'spinner' : ''} /> Refresh
                </button>
              </div>

              {(() => {
                const displayedFeedbacks = feedbacks
                  .filter(fb => {
                    if (feedbackFilter === 'verified') return fb.isVerifiedOnGoogle;
                    if (feedbackFilter === 'unverified') return !fb.isVerifiedOnGoogle;
                    return true;
                  })
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scans Today</span>
                          <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700 }}>{scansToday}</span>
                        </div>
                        <div style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Reviews</span>
                          <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700 }}>{feedbacks.length}</span>
                        </div>
                      </div>

                      {/* Filter buttons */}
                      <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        {[
                          { key: 'verified', label: 'Verified' },
                          { key: 'unverified', label: 'Unverified' },
                          { key: 'all', label: 'All' }
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            type="button"
                            onClick={() => setFeedbackFilter(btn.key as any)}
                            className="btn"
                            style={{
                              padding: '0.4rem 1rem',
                              fontSize: '0.8125rem',
                              borderRadius: 'var(--radius-sm)',
                              background: feedbackFilter === btn.key ? 'var(--accent)' : 'transparent',
                              color: feedbackFilter === btn.key ? '#fff' : 'var(--text-secondary)',
                              border: 'none',
                              boxShadow: 'none',
                              fontWeight: feedbackFilter === btn.key ? 600 : 400,
                              cursor: 'pointer'
                            }}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {feedbacks.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                        <ThumbsUp size={36} style={{ strokeWidth: 1.5, marginBottom: '1rem', color: 'var(--text-tertiary)' }} />
                        <p>No reviews received yet. Share your QR code to get started!</p>
                      </div>
                    ) : displayedFeedbacks.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                        <p>No {feedbackFilter} reviews found.</p>
                      </div>
                    ) : (
                      <div className="table-container">
                        <table className="feedback-table">
                          <thead>
                            <tr>
                              <th>Date & Time</th>
                              <th>Rating</th>
                              <th>Review Details</th>
                              <th>Verification</th>
                              <th>Mobile Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedFeedbacks.map((fb) => (
                        <tr key={fb._id || fb.id}>
                          <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '0.875rem' }}>{new Date(fb.createdAt).toLocaleDateString()}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(fb.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td>
                            <span className={`rating-badge ${fb.rating <= 2 ? 'low' : fb.rating <= 3 ? 'mid' : 'high'}`}>
                              <Star size={10} style={{ fill: 'currentColor' }} /> {fb.rating} Stars
                            </span>
                          </td>
                          <td style={{ maxWidth: '400px' }}>
                            <div>{fb.feedbackText}</div>
                            {fb.googleReviewAuthorName && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <GoogleLogoSvg /> <span>Google Reviewer: <strong>{fb.googleReviewAuthorName}</strong></span>
                              </div>
                            )}
                          </td>
                          <td>
                            {fb.isVerifiedOnGoogle ? (
                              <span className="copy-badge" style={{ color: 'var(--success)', backgroundColor: 'var(--success-light)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                                <Check size={12} strokeWidth={3} /> Verified
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Unverified</span>
                            )}
                          </td>
                          <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {fb.customerContact || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Not provided</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="fade-in">
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 size={20} color="var(--accent)" /> Analytics Overview
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase' }}>Avg Rating</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--warning)' }}>
                      {feedbacks.length > 0 ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1) : '0.0'}
                    </h2>
                  </div>
                  <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase' }}>5 Star Reviews</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--success)' }}>
                      {feedbacks.filter(fb => fb.rating === 5).length}
                    </h2>
                  </div>
                  <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase' }}>Low Ratings (1-3)</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--danger)' }}>
                      {feedbacks.filter(fb => fb.rating <= 3).length}
                    </h2>
                  </div>
                  <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase' }}>With Contact</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--accent)' }}>
                      {feedbacks.filter(fb => fb.customerContact).length}
                    </h2>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Star Distribution Bar Chart */}
                <div className="card">
                  <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Star Rating Distribution</h3>
                  {feedbacks.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={[
                        { stars: '1', count: feedbacks.filter((fb) => fb.rating === 1).length, fill: '#dc2626' },
                        { stars: '2', count: feedbacks.filter(fb => fb.rating === 2).length, fill: '#f97316' },
                        { stars: '3', count: feedbacks.filter(fb => fb.rating === 3).length, fill: '#eab308' },
                        { stars: '4', count: feedbacks.filter(fb => fb.rating === 4).length, fill: '#22c55e' },
                        { stars: '5', count: feedbacks.filter(fb => fb.rating === 5).length, fill: '#16a34a' },
                      ]} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="stars" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {[1, 2, 3, 4, 5].map((_, index) => (
                            <Cell key={index} fill={['#dc2626', '#f97316', '#eab308', '#22c55e', '#16a34a'][index]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-tertiary)' }}>
                      <p>No data yet</p>
                    </div>
                  )}
                </div>

                {/* Rating Pie Chart */}
                <div className="card">
                  <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Rating Breakdown</h3>
                  {feedbacks.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Positive (4-5)', value: feedbacks.filter(fb => fb.rating >= 4).length },
                            { name: 'Neutral (3)', value: feedbacks.filter(fb => fb.rating === 3).length },
                            { name: 'Negative (1-2)', value: feedbacks.filter(fb => fb.rating <= 2).length },
                          ].filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#16a34a" />
                          <Cell fill="#eab308" />
                          <Cell fill="#dc2626" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-tertiary)' }}>
                      <p>No data yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Over Time */}
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Reviews Over Time</h3>
                {feedbacks.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={(() => {
                      const grouped: Record<string, { date: string; count: number; avgRating: number }> = {};
                      [...feedbacks].reverse().forEach(fb => {
                        const date = new Date(fb.createdAt).toLocaleDateString();
                        if (!grouped[date]) grouped[date] = { date, count: 0, avgRating: 0 };
                        grouped[date].count++;
                        grouped[date].avgRating += fb.rating;
                      });
                      return Object.values(grouped).map(g => ({ ...g, avgRating: parseFloat((g.avgRating / g.count).toFixed(1)) }));
                    })()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} name="Reviews" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="avgRating" stroke="#eab308" strokeWidth={2} name="Avg Rating" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-tertiary)' }}>
                    <p>No reviews yet to display trends</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="card fade-in">
              <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={20} color="var(--accent)" /> Reports & Exports
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
                Download your business data as CSV files for analysis, record-keeping, or importing into other tools.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ border: '1px solid var(--border-light)', padding: '1.5rem' }}>
                  <MessageSquare size={32} color="var(--accent)" style={{ marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>All Feedbacks</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Export all customer reviews with ratings, feedback text, and contact info. Includes both positive reviews and private feedback.
                  </p>
                  <button className="btn btn-accent" onClick={exportFeedbacksCSV} disabled={!businessId} style={{ width: '100%' }}>
                    <Download size={16} /> Download Feedbacks CSV
                  </button>
                </div>

                <div className="card" style={{ border: '1px solid var(--border-light)', padding: '1.5rem' }}>
                  <Users size={32} color="var(--success)" style={{ marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Customer Contacts</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Export customer phone numbers from private feedback submissions. Useful for follow-ups and building your customer database.
                  </p>
                  <button className="btn btn-accent" onClick={exportContactsCSV} disabled={!businessId} style={{ width: '100%' }}>
                    <Download size={16} /> Download Contacts CSV
                  </button>
                </div>

                <div className="card" style={{ border: '1px solid var(--border-light)', padding: '1.5rem' }}>
                  <BarChart3 size={32} color="var(--warning)" style={{ marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Rating Summary</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Quick overview of your ratings distribution. 5-star: {feedbacks.filter(f => f.rating === 5).length}, 4-star: {feedbacks.filter(f => f.rating === 4).length}, 3-star: {feedbacks.filter(f => f.rating === 3).length}, 2-star: {feedbacks.filter(f => f.rating === 2).length}, 1-star: {feedbacks.filter(f => f.rating === 1).length}
                  </p>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>{feedbacks.length > 0 ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : '0'}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}> / 5 avg rating</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ==========================================
// 2. CUSTOMER RATING & REVIEW VIEW
// ==========================================
interface CustomerReviewProps {
  businessId: string;
  showToast: (msg: string) => void;
  navigateTo: (path: string) => void;
}

function CustomerReviewView({ businessId, showToast, navigateTo }: CustomerReviewProps) {
  const [business, setBusiness] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedReviewIdx, setSelectedReviewIdx] = useState<number | null>(null);

  // Private low rating form state
  const [feedbackText, setFeedbackText] = useState('');
  const [contact, setContact] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);


  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
  };

  const formatContactOnBlur = () => {
    const digits = contact.replace(/\D/g, '');
    if (digits.length === 0) return;
    if (digits.startsWith('91') && digits.length >= 12) {
      const local = digits.substring(digits.length - 10);
      setContact(`+91 ${local.substring(0, 5)} ${local.substring(5, 10)}`);
    } else if (digits.length >= 10) {
      const local = digits.substring(digits.length - 10);
      setContact(`+91 ${local.substring(0, 5)} ${local.substring(5, 10)}`);
    } else if (digits.length > 5) {
      setContact(`${digits.substring(0, 5)} ${digits.substring(5)}`);
    }
  };

  const handlePickContact = async () => {
    if ('contacts' in navigator) {
      try {
        const props = ['tel'];
        const contacts = await (navigator as any).contacts.select(props, { multiple: false });
        if (contacts && contacts.length > 0 && contacts[0].tel && contacts[0].tel.length > 0) {
          const raw = contacts[0].tel[0];
          const digits = raw.replace(/\D/g, '');
          const indian = digits.startsWith('91') ? digits.substring(2) : digits;
          setContact(`+91 ${indian.substring(0, 5)} ${indian.substring(5, 10)}`);
          showToast('Mobile number imported!');
        }
      } catch (err) {
        console.log('Contact selection cancelled or failed:', err);
      }
    }
  };

  // Load business context and log scan
  useEffect(() => {
    fetchBusinessContext();
    logScan();
  }, [businessId]);

  const logScan = async () => {
    try {
      await fetch(`${API_BASE}/business/${businessId}/scan`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (err) {
      console.log('Failed to log scan on server, running offline.');
    }
  };

  const fetchBusinessContext = async () => {
    try {
      const response = await fetch(`${API_BASE}/business/${businessId}`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setBusiness(data);
      } else {
        throw new Error('Not found on server');
      }
    } catch (err) {
      console.log('Failed fetching business from server, attempting local storage demo.');
      const localData = localStorage.getItem(`demo_biz_${businessId}`);
      if (localData) {
        setBusiness(JSON.parse(localData));
      } else {
        // Ultimate demo fallback in case nothing exists
        setBusiness({
          name: 'Sweet Tooth Bakery',
          category: 'Bakery',
          context: 'A cute local bakery with organic cakes, artisanal sourdough bread, and rich chocolate croissants. Highlight friendly staff and premium quality.',
          googleReviewUrl: 'https://g.page/r/YOUR_BUSINESS_ID/review'
        });
      }
    }
  };

  // Generate review suggestions for 4-5 stars
  const generateAIReviews = async (selectedRating: number, targetLanguage: string) => {
    setLoading(true);
    setReviews([]);
    setSelectedReviewIdx(null);
    try {
      const response = await fetch(`${API_BASE}/business/${businessId}/generate-reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ rating: selectedRating, language: targetLanguage })
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      } else {
        throw new Error('Server returned error');
      }
    } catch (err) {
      console.log('Server unreachable for generation. Running fallback generator.');
      // Simulating response matching backend fallback generator
      const mockReviews = getDemoGeneratedReviews(
        business?.name || 'This Business',
        business?.category || 'Service',
        business?.context || '',
        selectedRating,
        targetLanguage
      ).map((text, idx) => ({ id: `demo_${idx}`, text }));
      setTimeout(() => {
        setReviews(mockReviews);
        setLoading(false);
      }, 1000);
      return;
    }
    setLoading(false);
  };

  const handleRatingSelect = (stars: number) => {
    setRating(stars);
    // Reset feedback text when switching ratings, but keep contact (mobile number)
    setFeedbackText('');
    setFeedbackSubmitted(false);

    if (stars >= 2) {
      generateAIReviews(stars, language);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    if (rating >= 2) {
      generateAIReviews(rating, lang);
    }
  };

  const handleCopyAndRedirect = async (text: string, idx: number, revId?: string | null) => {
    setSelectedReviewIdx(idx);

    try {
      await navigator.clipboard.writeText(text);
      showToast('Review copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Failed to auto-copy. Please highlight and copy manually!');
    }

    try {
      await fetch(`${API_BASE}/business/${businessId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedbackText: text,
          customerContact: contact || '',
          stockReviewId: revId || undefined
        })
      });
    } catch (err) {
      console.log('Failed to log review on server, running offline.');
      // Local demo fallback
      const localFeedbacks = JSON.parse(localStorage.getItem(`feedbacks_${businessId}`) || '[]');
      localFeedbacks.push({
        id: Date.now().toString(),
        rating,
        feedbackText: text,
        customerContact: contact || '',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(`feedbacks_${businessId}`, JSON.stringify(localFeedbacks));
    }

    setTimeout(() => {
      window.open(business?.googleReviewUrl || 'https://google.com', '_blank');
    }, 1200);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      const response = await fetch(`${API_BASE}/business/${businessId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedbackText,
          customerContact: contact
        })
      });
      if (response.ok) {
        setFeedbackSubmitted(true);
      } else {
        showToast('Error saving feedback.');
      }
    } catch (err) {
      console.log('Server offline. Simulating local feedback submission.');
      // Fallback local storage logging
      const localFeedbacks = JSON.parse(localStorage.getItem(`feedbacks_${businessId}`) || '[]');
      localFeedbacks.push({
        id: Date.now().toString(),
        rating,
        feedbackText,
        customerContact: contact,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(`feedbacks_${businessId}`, JSON.stringify(localFeedbacks));

      setTimeout(() => {
        setFeedbackSubmitted(true);
        setIsSubmittingFeedback(false);
      }, 800);
      return;
    }
    setIsSubmittingFeedback(false);
  };

  if (!business) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '1rem' }}>
        <Loader2 size={36} className="spinner" color="var(--accent)" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading business details...</p>
      </div>
    );
  }

  if (!business.isApproved) {
    return (
      <div className="fade-in" style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', width: '100%' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <AlertCircle size={48} color="var(--warning)" style={{ marginBottom: '1.5rem', display: 'inline-block' }} />
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Portal Pending Approval</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            The Google Review portal for <strong>{business.name}</strong> is currently pending approval by the administrator. Please try again later.
          </p>
          <button className="btn btn-secondary" onClick={() => navigateTo('/admin')} style={{ width: '100%' }}>
            Go to Merchant Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', padding: '1.5rem' }}>
      {/* Mini Customer Header */}
      <div style={{ textAlign: 'center', padding: '1rem 0', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em' }}>{business.name}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Review Assistant</p>
      </div>

      <div className="card fade-in">
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ fontWeight: 600 }}>Mobile Number</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={contact}
              onChange={handleContactChange}
              onBlur={formatContactOnBlur}
              placeholder="XXXXX XXXXX"
              autoComplete="tel"
              inputMode="tel"
              style={{ flex: 1, fontVariantNumeric: 'tabular-nums' }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePickContact}
              style={{ padding: '0 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              title="Import from contacts"
            >
              <Users size={18} />
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Tap the icon to auto-fill from your phone contacts
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', marginBottom: '1.5rem' }} />

        <h3 style={{ textAlign: 'center', marginBottom: '0.5rem', fontWeight: 600 }}>How was your experience?</h3>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Tap stars to give your rating
        </p>

        {/* Stars Selector */}
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((stars) => (
            <button
              key={stars}
              type="button"
              className={`star-button ${(hoverRating || rating) >= stars ? 'active' : ''
                }`}
              onClick={() => handleRatingSelect(stars)}
              onMouseEnter={() => setHoverRating(stars)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star style={{ strokeWidth: 1.5 }} />
            </button>
          ))}
        </div>

        {/* 1. RATING CHOSEN: 2 to 5 STARS (GENERATE AI REVIEWS) */}
        {rating >= 2 && (
          <div className="fade-in" style={{ marginTop: '2rem' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', marginBottom: '1.5rem' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color="var(--accent)" /> Select review template:
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Languages size={14} color="var(--text-secondary)" />
                <select
                  className="form-select"
                  value={language}
                  onChange={handleLanguageChange}
                  style={{ padding: '0.25rem 1.75rem 0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', gap: '0.75rem' }}>
                <Loader2 size={24} className="spinner" color="var(--accent)" />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Drafting customized reviews for you...</p>
              </div>
            ) : (
              <div className="review-options-grid">
                {reviews.map((rev, idx) => {
                  const text = typeof rev === 'string' ? rev : rev.text;
                  const revId = typeof rev === 'string' ? null : rev.id;
                  return (
                    <div
                      key={idx}
                      className={`review-card ${selectedReviewIdx === idx ? 'selected' : ''}`}
                      onClick={() => handleCopyAndRedirect(text, idx, revId)}
                    >
                      <p className="review-card-text">{text}</p>
                      <div className="review-card-meta">
                        <span>Option {idx + 1}</span>
                        <span className="copy-badge">
                          {selectedReviewIdx === idx ? (
                            <>
                              <Check size={12} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Copy & Go to Google
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && reviews.length > 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '1.5rem', lineHeight: '1.4' }}>
                * Clicking copy copies the text to your phone's clipboard and redirects you to our official Google Review page. Just paste it in!
              </p>
            )}
          </div>
        )}

        {/* 2. RATING CHOSEN: 1 STAR (PRIVATE FEEDBACK GATING) */}
        {rating === 1 && (
          <div className="fade-in" style={{ marginTop: '2rem' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', marginBottom: '1.5rem' }} />

            {!feedbackSubmitted ? (
              <form onSubmit={handleFeedbackSubmit}>
                <div style={{ background: 'var(--accent-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={16} /> Private Message to Owner
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    We value your feedback. This feedback is sent directly to management to help improve our service, and will not be published publicly.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Tell us what went wrong?</label>
                  <textarea
                    className="form-textarea"
                    required
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Please let us know how we can make this right. Your satisfaction is our top priority."
                  />
                </div>

                <button type="submit" className="btn btn-accent" disabled={isSubmittingFeedback} style={{ width: '100%' }}>
                  {isSubmittingFeedback ? (
                    <>
                      <Loader2 size={16} className="spinner" />
                      Submitting feedback...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Submit Private Feedback
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="fade-in" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <ThumbsUp size={44} color="var(--success)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '0.5rem' }}>Feedback Received</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  Thank you for helping us grow. We have registered your feedback internally. A manager will review this details shortly to make things right.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigateTo('/admin')} style={{ fontSize: '0.75rem' }}>
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
}

// Fallback review generation templates for offline testing
function getDemoGeneratedReviews(name: string, category: string, _context: string, _rating: number, language: string): string[] {
  const templates: Record<string, string[]> = {
    'English': [
      `We had an amazing experience at ${name}! The quality of their ${category} service is top-notch. Staff was super friendly and everything was perfect.`,
      `Highly recommend ${name}! Truly the best in the business. Very attentive service and wonderful quality.`,
      `Such a lovely visit to this ${category}. They pay close attention to customer care and details. Definitely check them out!`,
      `Great experience! Super fast and friendly staff, top-tier service. Will be a regular here at ${name}!`,
      `Outstanding! Prompt, professional, and very friendly. Truly a premium experience.`
    ],
    'Spanish': [
      `¡Tuvimos una experiencia increíble en ${name}! La calidad de su servicio de ${category} es de primera. El personal fue súper amable y todo estuvo perfecto.`,
      `¡Muy recomendado ${name}! Verdaderamente el mejor en el negocio. Servicio muy atento y maravillosa calidad.`,
      `Una visita encantadora a este ${category}. Prestan mucha atención al cliente y a los detalles. ¡Definitivamente visítalos!`,
      `¡Gran experiencia! Personal súper rápido y amable, servicio de primer nivel. ¡Seré cliente habitual aquí en ${name}!`,
      `¡Excelente! Rápido, profesional y muy amable. Verdaderamente una experiencia premium.`
    ],
    'French': [
      `Nous avons passé un moment incroyable chez ${name} ! La qualité de leur service de ${category} est exceptionnelle. Le personnel était super sympa et tout était parfait.`,
      `Je recommande vivement ${name} ! Vraiment le meilleur dans son domaine. Service très attentionné et excellente qualité.`,
      `Une très agréable visite dans ce ${category}. Ils accordent une grande importance au service client. À découvrir absolument !`,
      `Superbe expérience ! Personnel très rapide et accueillant, service haut de gamme. Je reviendrai régulièrement chez ${name} !`,
      `Exceptionnel ! Rapide, professionnel et très chaleureux. Une véritable expérience premium.`
    ],
    'German': [
      `Wir hatten ein tolles Erlebnis bei ${name}! Die Qualität des ${category}-Service ist erstklassig. Das Personal war super freundlich und alles war perfekt.`,
      `Sehr zu empfehlen, ${name}! Wirklich der Beste in der Branche. Sehr aufmerksamer Service und wunderbare Qualität.`,
      `Ein so schöner Besuch in diesem ${category}. Sie legen großen Wert auf Kundenservice und Details. Schaut unbedingt vorbei!`,
      `Tolle Erfahrung! Super schnelles und freundliches Personal, erstklassiger Service. Werde Stammkunde bei ${name}!`,
      `Hervorragend! Schnell, professionell und sehr freundlich. Wirklich eine Premium-Erfahrung.`
    ],
    'Hindi': [
      `हमारा ${name} में अनुभव शानदार रहा! उनकी ${category} सेवा की गुणवत्ता बेहतरीन है। स्टाफ बेहद मिलनसार था और सब कुछ परफेक्ट था।`,
      `${name} की अत्यधिक सिफारिश करते हैं! वास्तव में व्यवसाय में सबसे अच्छे। बहुत ही चौकस सेवा और शानदार गुणवत्ता।`,
      `इस ${category} में बहुत अच्छी यात्रा रही। वे ग्राहकों की देखभाल और विवरणों पर बहुत ध्यान देते हैं। इसे ज़रूर देखें!`,
      `बढ़िया अनुभव! बहुत तेज़ और मिलनसार स्टाफ, शीर्ष स्तर की सेवा। ${name} पर नियमित रूप से आऊंगा!`,
      `उत्कृष्ट! त्वरित, पेशेवर और बहुत मिलनसार। वास्तव में एक प्रीमियम अनुभव।`
    ]
  };

  const defaultTemplates = templates['English'];
  const list = templates[language] || defaultTemplates;
  return list;
}

// ==========================================
// 3. SUPER ADMIN DASHBOARD VIEW
// ==========================================
interface SuperAdminProps {
  showToast: (msg: string) => void;
  navigateTo: (path: string) => void;
  user: AuthUser;
  logout: () => void;
}

function SuperAdminDashboard({ showToast, navigateTo, user, logout }: SuperAdminProps) {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'businesses' | 'registrations' | 'feedbacks' | 'add' | 'revenue'>('businesses');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form state for add/edit business
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Restaurant');
  const [context, setContext] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantPassword, setMerchantPassword] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit modal state
  const [editModal, setEditModal] = useState<{ show: boolean; biz: any }>({ show: false, biz: null });
  const [editForm, setEditForm] = useState({ name: '', category: '', context: '', googleReviewUrl: '', keywords: '', location: '', mobileNumber: '' });

  // Revenue state
  const [revenueData, setRevenueData] = useState<{ totalRevenue: number; activeSubscriptions: number; planCounts: any; monthlyRevenue: any[]; businessRevenue: any[] } | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subModal, setSubModal] = useState<{ show: boolean; bizId: string; bizName: string; regId?: string; isRenew?: boolean }>({ show: false, bizId: '', bizName: '' });
  const [subPlan, setSubPlan] = useState('yearly');
  const [subPaymentMethod, setSubPaymentMethod] = useState('UPI');
  const [subTxnId, setSubTxnId] = useState('');
  const [revTimeframe, setRevTimeframe] = useState('month');
  const [revStartDate, setRevStartDate] = useState('');
  const [revEndDate, setRevEndDate] = useState('');

  // Stock reviews modal state
  const [stockModal, setStockModal] = useState<{ show: boolean; bizId: string; bizName: string }>({ show: false, bizId: '', bizName: '' });
  const [stockData, setStockData] = useState<{
    stockCounts: { '2': number; '3': number; '4': number; '5': number };
    reviews: { _id: string; rating: number; reviewText: string; isUsed: boolean }[];
  }>({
    stockCounts: { '2': 0, '3': 0, '4': 0, '5': 0 },
    reviews: []
  });
  const [stockLoading, setStockLoading] = useState(false);
  const [stockGenerating, setStockGenerating] = useState(false);
  const [newStockRating, setNewStockRating] = useState<number>(5);
  const [newStockCount, setNewStockCount] = useState<number>(50);
  const [stockFilterRating, setStockFilterRating] = useState<string>('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchRevenueData = async (timeframe: string, start: string, end: string) => {
    try {
      let revUrl = `${API_BASE}/admin/revenue?timeframe=${timeframe}`;
      if (timeframe === 'custom' && start && end) {
        revUrl += `&startDate=${start}&endDate=${end}`;
      }
      const revRes = await fetch(revUrl, { credentials: 'include', headers: getAuthHeaders() });
      if (revRes.ok) setRevenueData(await revRes.json());
    } catch (err) {
      console.error('Failed to load revenue data', err);
    }
  };

  useEffect(() => {
    fetchRevenueData(revTimeframe, revStartDate, revEndDate);
  }, [revTimeframe, revStartDate, revEndDate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const bizRes = await fetch(`${API_BASE}/admin/businesses`, { credentials: 'include', headers: getAuthHeaders() });
      const fbRes = await fetch(`${API_BASE}/admin/feedbacks`, { credentials: 'include', headers: getAuthHeaders() });
      const usersRes = await fetch(`${API_BASE}/admin/users`, { credentials: 'include', headers: getAuthHeaders() });
      const regRes = await fetch(`${API_BASE}/admin/registrations`, { credentials: 'include', headers: getAuthHeaders() });
      if (bizRes.ok) setBusinesses(await bizRes.json());
      if (fbRes.ok) setFeedbacks(await fbRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (regRes.ok) setRegistrations(await regRes.json());

      const subRes = await fetch(`${API_BASE}/admin/subscriptions`, { credentials: 'include', headers: getAuthHeaders() });
      if (subRes.ok) setSubscriptions(await subRes.json());
    } catch (err) {
      console.error('Failed to load admin data from API.', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlanExpiryStatus = (biz: any) => {
    if (!biz.plan || biz.plan === 'lifetime' || !biz.planExpiry) {
      return { showRenew: false, isExpired: false, daysLeft: Infinity };
    }
    const expiryDate = new Date(biz.planExpiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { showRenew: true, isExpired: true, daysLeft: diffDays };
    } else if (diffDays <= 7) {
      return { showRenew: true, isExpired: false, daysLeft: diffDays };
    }
    return { showRenew: false, isExpired: false, daysLeft: diffDays };
  };

  const handleToggleApprove = async (biz: any) => {
    if (biz.isApproved) {
      showToast('Once approved, approval status cannot be changed.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/admin/business/${biz._id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ isApproved: !biz.isApproved })
      });
      if (response.ok) {
        const updated = await response.json();
        setBusinesses(prev => prev.map(b => b._id === updated._id ? updated : b));
        showToast(`Business Approved!`);
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to approve.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server.');
    }
  };

  const handleToggleActive = async (biz: any) => {
    try {
      const res = await fetch(`${API_BASE}/admin/business/${biz._id}/toggle-active`, {
        method: 'PUT', headers: getAuthHeaders(), credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setBusinesses(prev => prev.map(b => b._id === biz._id ? { ...b, isActive: data.isActive } : b));
        showToast(data.isActive ? 'Access restored' : 'Access revoked');
      }
    } catch { showToast('Error toggling access.'); }
  };

  const fetchStockData = async (bizId: string) => {
    setStockLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/business/${bizId}/stock`, {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setStockData(data);
      } else {
        showToast('Failed to load stock reviews.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server.');
    } finally {
      setStockLoading(false);
    }
  };

  const handleOpenStockModal = (biz: any) => {
    setStockModal({ show: true, bizId: biz._id, bizName: biz.name });
    setNewStockRating(5);
    setNewStockCount(50);
    setStockFilterRating('all');
    fetchStockData(biz._id);
  };

  const handleGenerateStockReviews = async () => {
    if (newStockCount <= 0 || newStockCount > 200) {
      showToast('Please enter a count between 1 and 200.');
      return;
    }
    setStockGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/admin/business/${stockModal.bizId}/generate-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ rating: newStockRating, count: newStockCount })
      });
      if (res.ok) {
        showToast(`Successfully generated and added ${newStockCount} reviews to stock!`);
        await fetchStockData(stockModal.bizId);
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to generate stock reviews.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error generating reviews.');
    } finally {
      setStockGenerating(false);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this business and all its feedbacks? This action is irreversible.')) return;
    try {
      const response = await fetch(`${API_BASE}/admin/business/${id}`, {
        method: 'DELETE', credentials: 'include', headers: getAuthHeaders()
      });
      if (response.ok) {
        setBusinesses(prev => prev.filter(b => b._id !== id));
        setFeedbacks(prev => prev.filter(f => f.businessId !== id));
        showToast('Business deleted.');
      }
    } catch (err) {
      console.error(err);
      setBusinesses(prev => prev.filter(b => b._id !== id));
      showToast('Offline mode: Deleted business locally.');
    }
  };

  const handleRegisterOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, any> = { name, category, context, googleReviewUrl, keywords, location, mobileNumber, isApproved };
      let response;
      if (editingId) {
        response = await fetch(`${API_BASE}/admin/business/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include', body: JSON.stringify(payload)
        });
      } else {
        payload.email = merchantEmail;
        payload.password = merchantPassword;
        response = await fetch(`${API_BASE}/admin/business`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include', body: JSON.stringify(payload)
        });
      }
      if (response.ok) {
        const data = await response.json();
        if (editingId) {
          setBusinesses(prev => prev.map(b => b._id === editingId ? data : b));
          showToast('Business details updated!');
          setEditingId(null);
        } else {
          setBusinesses(prev => [data.business || data, ...prev]);
          showToast('Business registered successfully!');
        }
        setName(''); setCategory('Restaurant'); setContext(''); setGoogleReviewUrl('');
        setKeywords(''); setLocation(''); setMobileNumber('');
        setIsApproved(false); setMerchantEmail(''); setMerchantPassword('');
        setActiveTab('businesses');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to backend server.');
    }
  };

  const handleEditClick = (biz: any) => {
    setEditingId(biz._id);
    setName(biz.name); setCategory(biz.category); setContext(biz.context);
    setGoogleReviewUrl(biz.googleReviewUrl); setIsApproved(biz.isApproved);
    setKeywords(Array.isArray(biz.keywords) ? biz.keywords.join(', ') : '');
    setLocation(biz.location || ''); setMobileNumber(biz.mobileNumber || '');
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingId(null); setName(''); setCategory('Restaurant'); setContext('');
    setGoogleReviewUrl(''); setKeywords(''); setLocation(''); setMobileNumber('');
    setIsApproved(false); setActiveTab('businesses');
  };

  // Edit modal handlers
  const openEditModal = (biz: any) => {
    setEditModal({ show: true, biz });
    setEditForm({
      name: biz.name, category: biz.category, context: biz.context,
      googleReviewUrl: biz.googleReviewUrl,
      keywords: Array.isArray(biz.keywords) ? biz.keywords.join(', ') : (biz.keywords || ''),
      location: biz.location || '', mobileNumber: biz.mobileNumber || ''
    });
  };

  const closeEditModal = () => setEditModal({ show: false, biz: null });

  const handleSaveEditModal = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/business/${editModal.biz._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include',
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setBusinesses(prev => prev.map(b => b._id === updated._id ? updated : b));
        showToast('Business updated!');
        closeEditModal();
      }
    } catch {
      showToast('Error saving changes.');
    }
  };

  // Registration handlers
  const handleApproveRegistration = async (regId: string, plan: string, paymentMethod: string, transactionId?: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${regId}/approve`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ plan, paymentMethod, transactionId })
      });
      if (res.ok) {
        showToast(`Registration approved! Business created and plan activated.`);
        fetchAdminData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to approve.');
      }
    } catch {
      showToast('Error connecting to server.');
    }
  };

  const handleRejectRegistration = async (reg: any) => {
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${reg._id}/reject`, {
        method: 'PUT', credentials: 'include', headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Registration rejected.');
        fetchAdminData();
      }
    } catch {
      showToast('Error connecting to server.');
    }
  };

  const pendingRegistrations = registrations.filter(r => r.status === 'pending');

  const handleSubscribe = async () => {
    try {
      if (subModal.regId) {
        await handleApproveRegistration(subModal.regId, subPlan, subPaymentMethod, subTxnId);
        setSubModal({ show: false, bizId: '', bizName: '' });
        setSubTxnId('');
        return;
      }
      const res = await fetch(`${API_BASE}/admin/subscribe`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include',
        body: JSON.stringify({ businessId: subModal.bizId, plan: subPlan, paymentMethod: subPaymentMethod, transactionId: subTxnId })
      });
      if (res.ok) {
        showToast(subModal.isRenew ? 'Subscription renewed successfully!' : 'Subscription activated!');
        setSubModal({ show: false, bizId: '', bizName: '' });
        setSubTxnId('');
        fetchAdminData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to activate subscription.');
      }
    } catch {
      showToast('Error connecting to server.');
    }
  };

  return (
    <div className="fade-in" style={{ padding: '0 1.5rem' }}>
      <header className="app-header">
        <div className="app-logo" onClick={() => navigateTo('/admin')}>
          <Sparkles size={24} />
          <span>Review Our</span> Business
        </div>

        {/* Desktop Header User Info */}
        <div className="desktop-header-user" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{user.email}</span>
          <button className="btn btn-outline" onClick={logout} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            Logout
          </button>
          <div className="copy-badge" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
            <Shield size={16} /> Super Admin
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="mobile-menu-toggle super-admin-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Backdrop for Super Admin mobile menu */}
      {isMobileMenuOpen && <div className="sidebar-backdrop" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Super Admin Mobile Drawer */}
      <aside className={`super-admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo" onClick={() => { navigateTo('/admin'); setIsMobileMenuOpen(false); }}>
          <Sparkles size={22} />
          <span>Review Our</span> Business
        </div>
        <div className="sidebar-header">
          <div className="copy-badge" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', display: 'inline-flex', width: 'fit-content' }}>
            <Shield size={14} style={{ marginRight: '4px' }} /> Super Admin
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'businesses' ? 'active' : ''} onClick={() => { setActiveTab('businesses'); setIsMobileMenuOpen(false); }}>
            <Users size={16} style={{ marginRight: '6px' }} /> Partner Businesses
          </button>
          <button className={activeTab === 'registrations' ? 'active' : ''} onClick={() => { setActiveTab('registrations'); setIsMobileMenuOpen(false); }}>
            <AlertCircle size={16} style={{ marginRight: '6px' }} />
            Registrations {pendingRegistrations.length > 0 && <span className="copy-badge" style={{ marginLeft: '6px', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{pendingRegistrations.length}</span>}
          </button>
          <button className={activeTab === 'add' ? 'active' : ''} onClick={() => { setActiveTab('add'); setIsMobileMenuOpen(false); }}>
            <Settings size={16} style={{ marginRight: '6px' }} />
            {editingId ? 'Edit Business Details' : 'Register New Business'}
          </button>
          <button className={activeTab === 'feedbacks' ? 'active' : ''} onClick={() => { setActiveTab('feedbacks'); setIsMobileMenuOpen(false); }}>
            <MessageSquare size={16} style={{ marginRight: '6px' }} /> System-Wide Feedbacks
          </button>
          <button className={activeTab === 'revenue' ? 'active' : ''} onClick={() => { setActiveTab('revenue'); setIsMobileMenuOpen(false); }}>
            <BarChart3 size={16} style={{ marginRight: '6px' }} /> Revenue & Plans
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            <button className="btn btn-outline btn-sm" onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ width: '100%', fontSize: '0.8125rem' }}>
              <Lock size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Users size={24} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>TOTAL PARTNERS</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{businesses.length}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <AlertCircle size={24} color={pendingRegistrations.length > 0 ? 'var(--warning)' : 'var(--text-tertiary)'} style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>PENDING REGISTRATIONS</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: pendingRegistrations.length > 0 ? 'var(--warning)' : 'inherit' }}>{pendingRegistrations.length}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <MessageSquare size={24} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>PRIVATE CRITIQUES</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{feedbacks.length}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Lock size={24} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>MERCHANT ACCOUNTS</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{users.filter(u => u.role === 'merchant').length}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'businesses' ? 'active' : ''}`} onClick={() => setActiveTab('businesses')}>
          <Users size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Partner Businesses
        </button>
        <button className={`tab-btn ${activeTab === 'registrations' ? 'active' : ''}`} onClick={() => setActiveTab('registrations')}>
          <AlertCircle size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Registrations {pendingRegistrations.length > 0 && <span className="copy-badge" style={{ marginLeft: '6px', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{pendingRegistrations.length}</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
          <Settings size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          {editingId ? 'Edit Business Details' : 'Register New Business'}
        </button>
        <button className={`tab-btn ${activeTab === 'feedbacks' ? 'active' : ''}`} onClick={() => setActiveTab('feedbacks')}>
          <MessageSquare size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> System-Wide Feedbacks
        </button>
        <button className={`tab-btn ${activeTab === 'revenue' ? 'active' : ''}`} onClick={() => setActiveTab('revenue')}>
          <BarChart3 size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Revenue & Plans
        </button>
      </div>

      {activeTab === 'businesses' && (
        <div className="card fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Registered Partnerships</h3>
            <button className="btn btn-outline btn-sm" onClick={fetchAdminData} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spinner' : ''} /> Refresh
            </button>
          </div>

          {businesses.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No businesses registered yet. Use the registration tab to register one.</p>
          ) : (
            <div className="table-container">
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Business Details</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Mobile</th>
                    <th>Plan</th>
                    <th>Approval</th>
                    <th>Access</th>
                    <th>Review Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map(biz => (
                    <tr key={biz._id}>
                      <td>
                        <strong style={{ display: 'block', fontSize: '0.9375rem' }}>{biz.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={biz.context}>
                          {biz.context}
                        </span>
                        {biz.keywords && biz.keywords.length > 0 && (
                          <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {biz.keywords.slice(0, 3).map((kw: string, i: number) => (
                              <span key={i} style={{ fontSize: '0.65rem', background: 'var(--bg-secondary)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>{kw}</span>
                            ))}
                            {biz.keywords.length > 3 && <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>+{biz.keywords.length - 3}</span>}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>{biz.category}</td>
                      <td style={{ fontSize: '0.8125rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{biz.location || '—'}</td>
                      <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{biz.mobileNumber || '—'}</td>
                      <td>
                        <span className="copy-badge" style={{
                          backgroundColor: biz.plan === 'lifetime' ? 'var(--warning)' : biz.plan === 'yearly' ? 'var(--accent)' : 'var(--text-tertiary)',
                          color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', textTransform: 'uppercase'
                        }}>
                          {biz.plan}
                        </span>
                        {biz.planExpiry && (
                          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                            {biz.plan === 'lifetime' ? 'No expiry' : `Exp: ${new Date(biz.planExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                          </span>
                        )}
                        {(() => {
                          const status = getPlanExpiryStatus(biz);
                          if (!status.showRenew) return null;
                          return (
                            <button
                              type="button"
                              className="btn"
                              onClick={() => setSubModal({ show: true, bizId: biz._id, bizName: biz.name, isRenew: true })}
                              style={{
                                display: 'block',
                                width: '100%',
                                marginTop: '0.35rem',
                                padding: '0.2rem 0.4rem',
                                fontSize: '0.65rem',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'center',
                                backgroundColor: status.isExpired ? 'var(--success)' : 'var(--warning)',
                                color: status.isExpired ? '#fff' : '#000',
                              }}
                            >
                              Renew {status.isExpired ? '(Expired)' : ''}
                            </button>
                          );
                        })()}
                      </td>
                      <td>
                        {biz.isApproved ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'var(--success)',
                            border: '1px solid var(--border-light)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            minWidth: '100px',
                            justifyContent: 'center',
                            backgroundColor: 'transparent'
                          }}>
                            <CheckCircle size={12} /> Approved
                          </div>
                        ) : (
                          <button
                            className="btn btn-accent"
                            onClick={() => handleToggleApprove(biz)}
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minWidth: '100px' }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <XCircle size={12} /> Pending
                            </span>
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${biz.isActive ? 'btn-accent' : 'btn-secondary'}`}
                          onClick={() => handleToggleActive(biz)}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minWidth: '90px' }}
                        >
                          {biz.isActive ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fff' }}>
                              <CheckCircle size={12} /> Active
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                              <XCircle size={12} /> Off
                            </span>
                          )}
                        </button>
                      </td>
                      <td>
                        <a
                          href={`/review/${biz._id}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          Open Review <ExternalLink size={12} />
                        </a>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline" onClick={() => openEditModal(biz)} style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }} title="Quick Edit">
                            <Edit2 size={12} />
                          </button>
                          <button className="btn btn-outline" onClick={() => handleEditClick(biz)} style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem' }} title="Full Edit Form">
                            <Settings size={12} />
                          </button>
                          <button className="btn btn-outline" onClick={() => handleOpenStockModal(biz)} style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', borderColor: 'var(--warning)', color: 'var(--warning)' }} title="Manage Stock Reviews">
                            <MessageSquare size={12} />
                          </button>
                          <button className="btn btn-outline" onClick={() => handleDeleteBusiness(biz._id)} style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }} title="Delete Business">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'registrations' && (
        <div className="card fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Merchant Registration Requests</h3>
            <button className="btn btn-outline btn-sm" onClick={fetchAdminData} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spinner' : ''} /> Refresh
            </button>
          </div>

          {pendingRegistrations.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No registration requests yet.</p>
          ) : (
            <div className="table-container">
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Business Info</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>Google Review</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRegistrations.map(reg => (
                    <tr key={reg._id}>
                      <td>
                        <strong style={{ display: 'block', fontSize: '0.9375rem' }}>{reg.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{reg.category}</span>
                        {reg.context && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={reg.context}>{reg.context}</span>}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', display: 'block' }}>{reg.email}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{reg.mobileNumber || 'No phone'}</span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reg.location || '—'}</td>
                      <td>
                        {reg.googleReviewUrl ? (
                          <a href={reg.googleReviewUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none' }}>
                            View <ExternalLink size={10} />
                          </a>
                        ) : '—'}
                      </td>
                      <td>
                        <span className="copy-badge" style={{
                          backgroundColor: reg.status === 'approved' ? 'var(--success)' : reg.status === 'rejected' ? 'var(--danger)' : 'var(--warning)',
                          color: '#fff', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem'
                        }}>
                          {reg.status}
                        </span>
                      </td>
                      <td>
                        {reg.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-accent" onClick={() => setSubModal({ show: true, bizId: '', bizName: reg.name, regId: reg._id })}
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                              <CheckCircle size={12} /> Payment
                            </button>
                            <button className="btn btn-outline" onClick={() => handleRejectRegistration(reg)}
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--danger)' }}>
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="card fade-in">
          <h3>{editingId ? `Editing details for "${name}"` : 'Register a New Partner Business'}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Set up the business context and Google review link. Business must be set to 'Approved' for customers to start generating reviews.
          </p>

          <form onSubmit={handleRegisterOrUpdate}>
            <div className="form-grid-2-section">
              {/* Left Column: Profile & Contact */}
              <div>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Luigi's Pizza Palace" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Business Category</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Restaurant">Restaurant / Cafe</option>
                    <option value="Medical Clinic">Dental / Medical Clinic</option>
                    <option value="Auto Repair">Car Mechanic / Auto Repair</option>
                    <option value="Retail Store">Retail Shop / Boutique</option>
                    <option value="Hair Salon">Hair Salon / Spa</option>
                    <option value="Hotel">Hotel / Guesthouse</option>
                    <option value="Professional Services">Lawyer / Accountant / Agency</option>
                    <option value="Other">Other Service Business</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. 123 Main St, Mumbai" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input type="tel" name="tel" autoComplete="tel" className="form-input" value={mobileNumber}
                      onChange={(e) => { let d = e.target.value.replace(/\D/g, '').slice(0, 10); if (d.length > 5) d = `${d.slice(0, 5)} ${d.slice(5)}`; setMobileNumber(d); }}
                      placeholder="XXXXX XXXXX" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Google Review URL</label>
                  <input type="url" className="form-input" value={googleReviewUrl} onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    placeholder="https://g.page/r/YOUR_BUSINESS_ID/review" required />
                </div>

                <div className="form-group">
                  <label className="form-label">SEO Keywords (comma-separated)</label>
                  <input type="text" className="form-input" value={keywords} onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. best pizza mumbai, italian restaurant, wood fired pizza" />
                </div>
              </div>

              {/* Right Column: AI Context & Account */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="form-group">
                    <label className="form-label">AI Prompt Context (Tell AI about the business)</label>
                    <textarea className="form-textarea" value={context} onChange={(e) => setContext(e.target.value)}
                      style={{ height: '140px' }}
                      placeholder="e.g. Cozy Italian pizza shop famous for wood-fired pizza and friendly staff." required />
                  </div>

                  {!editingId && (
                    <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '1rem', paddingTop: '1rem' }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>MERCHANT ACCOUNT</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Merchant Email</label>
                          <input type="email" className="form-input" value={merchantEmail} onChange={(e) => setMerchantEmail(e.target.value)}
                            placeholder="merchant@business.com" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Merchant Password</label>
                          <input type="password" className="form-input" value={merchantPassword} onChange={(e) => setMerchantPassword(e.target.value)}
                            placeholder="Min 6 characters" required minLength={6} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                    <input type="checkbox" id="isApproved" checked={isApproved} onChange={(e) => setIsApproved(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <label htmlFor="isApproved" style={{ fontWeight: 500, fontSize: '0.9375rem', cursor: 'pointer' }}>
                      Approve and Activate this business portal immediately
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                  <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                    {editingId ? 'Save Profile Changes' : 'Register & Setup Business'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'feedbacks' && (
        <div className="card fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>System-Wide Private Feedback Log</h3>
            <button className="btn btn-outline btn-sm" onClick={fetchAdminData} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spinner' : ''} /> Refresh
            </button>
          </div>

          {feedbacks.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No private feedback reports received yet.</p>
          ) : (
            <div className="table-container">
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Business</th>
                    <th>Rating</th>
                    <th>Feedback Details</th>
                    <th>Verification</th>
                    <th>Contact Info</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map(fb => (
                    <tr key={fb._id}>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: 600 }}>{fb.businessId?.name || 'Unknown Partner'}</td>
                      <td>
                        <span className={`rating-badge ${fb.rating <= 2 ? 'low' : fb.rating <= 3 ? 'mid' : 'high'}`}>
                          <Star size={10} style={{ fill: 'currentColor' }} /> {fb.rating} Stars
                        </span>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <div>{fb.feedbackText}</div>
                        {fb.googleReviewAuthorName && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <GoogleLogoSvg /> <span>Google Reviewer: <strong>{fb.googleReviewAuthorName}</strong></span>
                          </div>
                        )}
                      </td>
                      <td>
                        {fb.isVerifiedOnGoogle ? (
                          <span className="copy-badge" style={{ color: 'var(--success)', backgroundColor: 'var(--success-light)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                            <Check size={12} strokeWidth={3} /> Verified
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Unverified</span>
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{fb.customerContact || 'Anonymous'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="card fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>Revenue & Subscription Plans</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                {['day', 'week', 'month', 'year', 'custom'].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setRevTimeframe(tf)}
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: revTimeframe === tf ? 'var(--accent)' : 'transparent',
                      color: revTimeframe === tf ? '#fff' : 'var(--text-secondary)',
                      border: 'none',
                      boxShadow: 'none',
                      textTransform: 'capitalize',
                      fontWeight: revTimeframe === tf ? 600 : 400
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {revTimeframe === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="date"
                    className="form-input"
                    value={revStartDate}
                    onChange={(e) => setRevStartDate(e.target.value)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto', margin: 0 }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>to</span>
                  <input
                    type="date"
                    className="form-input"
                    value={revEndDate}
                    onChange={(e) => setRevEndDate(e.target.value)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto', margin: 0 }}
                  />
                </div>
              )}
            </div>
          </div>

          {revenueData && (
            <>
              <div className="revenue-stats-grid">
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>TOTAL REVENUE</p>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>₹{revenueData.totalRevenue.toLocaleString('en-IN')}</h2>
                </div>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ACTIVE SUBSCRIPTIONS</p>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{revenueData.activeSubscriptions}</h2>
                </div>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>PLAN DISTRIBUTION</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem' }}><strong style={{ color: 'var(--text-tertiary)' }}>Free:</strong> {revenueData.planCounts.free}</span>
                    <span style={{ fontSize: '0.8125rem' }}><strong style={{ color: 'var(--accent)' }}>Yearly:</strong> {revenueData.planCounts.yearly}</span>
                    <span style={{ fontSize: '0.8125rem' }}><strong style={{ color: 'var(--warning)' }}>Lifetime:</strong> {revenueData.planCounts.lifetime}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>
                  {revTimeframe === 'day' ? 'Hourly Revenue (Today)' :
                   revTimeframe === 'week' ? 'Daily Revenue (Last 7 Days)' :
                   revTimeframe === 'month' ? 'Weekly Revenue (Last 30 Days)' :
                   revTimeframe === 'year' ? 'Monthly Revenue (Last 12 Months)' :
                   'Revenue Breakdown (Custom Range)'}
                </h4>
                {revenueData.monthlyRevenue && revenueData.monthlyRevenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem' }}>No revenue data yet.</p>
                )}
              </div>
            </>
          )}

          {revenueData?.businessRevenue && revenueData.businessRevenue.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Revenue by Business</h4>
              <div className="table-container">
                <table className="feedback-table">
                  <thead>
                    <tr>
                      <th>Business</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Activated</th>
                      <th>Expires</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(revenueData?.businessRevenue || []).map((br: any, i: number) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{br.businessName}</td>
                        <td>
                          <span className="copy-badge" style={{
                            backgroundColor: br.plan === 'lifetime' ? 'var(--warning)' : 'var(--accent)',
                            color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', textTransform: 'uppercase'
                          }}>
                            {br.plan}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>₹{br.amount.toLocaleString('en-IN')}</td>
                        <td style={{ fontSize: '0.8125rem' }}>{br.activatedAt ? new Date(br.activatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                        <td style={{ fontSize: '0.8125rem' }}>{br.plan === 'lifetime' ? 'Never' : br.expiresAt ? new Date(br.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                        <td>
                          <span className="copy-badge" style={{
                            backgroundColor: br.isActive ? 'var(--success)' : 'var(--danger)',
                            color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem'
                          }}>
                            {br.isActive ? 'Active' : 'Revoked'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4>Subscription History</h4>
            <button className="btn btn-outline btn-sm" onClick={fetchAdminData} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spinner' : ''} /> Refresh
            </button>
          </div>

          {subscriptions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No subscriptions yet.</p>
          ) : (
            <div className="table-container">
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Business</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Activated</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Access</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map(sub => (
                    <tr key={sub._id}>
                      <td style={{ fontWeight: 600 }}>{sub.businessId?.name || 'Unknown'}</td>
                      <td>
                        <span className="copy-badge" style={{
                          backgroundColor: sub.plan === 'lifetime' ? 'var(--warning)' : 'var(--accent)',
                          color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', textTransform: 'uppercase'
                        }}>
                          {sub.plan} — ₹{sub.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>{sub.startDate ? new Date(sub.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td style={{ fontSize: '0.8125rem' }}>{sub.plan === 'lifetime' ? 'Never' : sub.endDate ? new Date(sub.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td>
                        <span className="copy-badge" style={{
                          backgroundColor: sub.status === 'active' ? 'var(--success)' : sub.status === 'revoked' ? 'var(--danger)' : 'var(--warning)',
                          color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem'
                        }}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        {sub.status === 'expired' ? (
                          <button
                            className="btn btn-sm btn-accent"
                            onClick={() => {
                              if (!sub.businessId?._id) return;
                              setSubModal({
                                show: true,
                                bizId: sub.businessId._id,
                                bizName: sub.businessId.name || 'Unknown'
                              });
                            }}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          >
                            Renew
                          </button>
                        ) : (
                          <button
                            className={`btn btn-sm ${sub.status === 'active' ? 'btn-danger' : 'btn-accent'}`}
                            onClick={async () => {
                              if (!sub.businessId?._id) return;
                              try {
                                const res = await fetch(`${API_BASE}/admin/business/${sub.businessId._id}/toggle-active`, {
                                  method: 'PUT', headers: getAuthHeaders(), credentials: 'include'
                                });
                                if (res.ok) {
                                  showToast(sub.status === 'active' ? 'Access revoked' : 'Access restored');
                                  fetchAdminData();
                                }
                              } catch { showToast('Error toggling access.'); }
                            }}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          >
                            {sub.status === 'active' ? 'Revoke' : 'Restore'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Plan Pricing</h4>
            <div className="pricing-grid">
              <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '2px solid var(--accent)' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--accent)' }}>Yearly</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹999<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/yr</span></p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Valid for 1 year from activation</p>
              </div>
              <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '2px solid var(--warning)' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--warning)' }}>Lifetime</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹1,499</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>One-time payment, no expiry</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2.5rem' }}></div>

      {/* Quick Edit Modal */}
      {editModal.show && editModal.biz && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeEditModal(); }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '560px', maxHeight: '85vh', overflow: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Edit Business: {editModal.biz.name}</h3>
              <button onClick={closeEditModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-secondary)' }}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Business Name</label>
              <input type="text" className="form-input" value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={editForm.category} onChange={(e) => setEditForm(p => ({ ...p, category: e.target.value }))}>
                <option value="Restaurant">Restaurant / Cafe</option>
                <option value="Medical Clinic">Dental / Medical Clinic</option>
                <option value="Auto Repair">Car Mechanic / Auto Repair</option>
                <option value="Retail Store">Retail Shop / Boutique</option>
                <option value="Hair Salon">Hair Salon / Spa</option>
                <option value="Hotel">Hotel / Guesthouse</option>
                <option value="Professional Services">Lawyer / Accountant / Agency</option>
                <option value="Other">Other Service Business</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" value={editForm.location} onChange={(e) => setEditForm(p => ({ ...p, location: e.target.value }))} placeholder="Address..." />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input type="tel" name="tel" autoComplete="tel" className="form-input" value={editForm.mobileNumber} onChange={(e) => setEditForm(p => ({ ...p, mobileNumber: e.target.value }))} placeholder="XXXXX XXXXX" />
            </div>
            <div className="form-group">
              <label className="form-label">Google Review URL</label>
              <input type="url" className="form-input" value={editForm.googleReviewUrl} onChange={(e) => setEditForm(p => ({ ...p, googleReviewUrl: e.target.value }))} placeholder="https://g.page/..." />
            </div>
            <div className="form-group">
              <label className="form-label">AI Context / Description</label>
              <textarea className="form-textarea" value={editForm.context} onChange={(e) => setEditForm(p => ({ ...p, context: e.target.value }))} rows={3} />
            </div>
            <div className="form-group">
              <label className="form-label">Keywords (comma-separated)</label>
              <input type="text" className="form-input" value={editForm.keywords} onChange={(e) => setEditForm(p => ({ ...p, keywords: e.target.value }))} placeholder="e.g. best pizza, italian food, mumbai restaurant" />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleSaveEditModal}>Save Changes</button>
              <button className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {subModal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSubModal({ show: false, bizId: '', bizName: '' }); }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>
              {subModal.regId ? 'Approve Registration & Payment:' : (subModal.isRenew ? 'Renew Plan:' : 'Assign Plan:')} {subModal.bizName}
            </h3>

            <div className="form-group">
              <label className="form-label">Select Plan</label>
              <select className="form-select" value={subPlan} onChange={(e) => setSubPlan(e.target.value)}>
                <option value="yearly">Yearly (₹999/yr)</option>
                <option value="lifetime">Lifetime (₹1,499 one-time)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select className="form-select" value={subPaymentMethod} onChange={(e) => setSubPaymentMethod(e.target.value)}>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="NetBanking">Net Banking</option>
                <option value="Cash">Cash</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction ID (optional)</label>
              <input type="text" className="form-input" value={subTxnId} onChange={(e) => setSubTxnId(e.target.value)}
                placeholder="e.g. UPI txn reference" />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleSubscribe}>
                {subModal.regId ? 'Approve & Activate' : (subModal.isRenew ? 'Renew Plan' : 'Activate Plan')}
              </button>
              <button className="btn btn-secondary" onClick={() => setSubModal({ show: false, bizId: '', bizName: '' })}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Reviews Manager Modal */}
      {stockModal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget) setStockModal({ show: false, bizId: '', bizName: '' }); }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: '2rem', overflow: 'hidden' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Stock Reviews: {stockModal.bizName}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Manage the pre-generated pool of reviews. Customers will select from these stock reviews when giving ratings (except 1-star which goes directly to private feedback).
            </p>

            {stockLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', gap: '0.75rem', flex: 1 }}>
                <Loader2 size={24} className="spinner" color="var(--accent)" />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading stock information...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                
                {/* Stock Counts Summary */}
                <div className="stock-summary-grid" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  {[5, 4, 3, 2].map(rating => (
                    <div key={rating} style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2px', color: 'var(--warning)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {rating} <Star size={12} fill="var(--warning)" style={{ strokeWidth: 1.5 }} />
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {stockData.stockCounts[rating.toString() as keyof typeof stockData.stockCounts] || 0}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>available</div>
                    </div>
                  ))}
                </div>

                {/* Generate / Add Stock Form */}
                <div style={{ border: '1px dashed var(--border-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Add More Reviews to Stock</h4>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Target Star Rating</label>
                      <select className="form-select" value={newStockRating} onChange={(e) => setNewStockRating(Number(e.target.value))} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                      </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Number of Reviews</label>
                      <input type="number" min={1} max={200} className="form-input" value={newStockCount} onChange={(e) => setNewStockCount(Number(e.target.value))} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} />
                    </div>
                    <button className="btn btn-accent" onClick={handleGenerateStockReviews} disabled={stockGenerating} style={{ padding: '0.6rem 1.5rem', minWidth: '160px', height: '40px', fontSize: '0.875rem' }}>
                      {stockGenerating ? (
                        <>
                          <Loader2 size={14} className="spinner" /> Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} /> Generate Stock
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Current Stock Reviews List */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Available Reviews List</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Filter by star:</span>
                      <select className="form-select" value={stockFilterRating} onChange={(e) => setStockFilterRating(e.target.value)} style={{ padding: '0.25rem 1.5rem 0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}>
                        <option value="all">All Stars</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', maxHeight: '250px', overflowY: 'auto', background: 'var(--bg-secondary)' }}>
                    {stockData.reviews.filter(r => stockFilterRating === 'all' || r.rating.toString() === stockFilterRating).length === 0 ? (
                      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem', textAlign: 'center', padding: '1.5rem' }}>No pre-generated reviews found for this rating.</p>
                    ) : (
                      stockData.reviews
                        .filter(r => stockFilterRating === 'all' || r.rating.toString() === stockFilterRating)
                        .map((r) => (
                          <div key={r._id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', padding: '0.75rem 1rem', fontSize: '0.8125rem', alignItems: 'flex-start', background: 'var(--bg-primary)' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'var(--warning-light)', color: 'var(--warning)', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, flexShrink: 0 }}>
                              {r.rating} <Star size={10} fill="var(--warning)" style={{ strokeWidth: 1.5 }} />
                            </span>
                            <p style={{ color: 'var(--text-primary)', margin: 0, flex: 1, lineHeight: '1.4' }}>{r.reviewText}</p>
                          </div>
                        ))
                    )}
                  </div>
                </div>

              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setStockModal({ show: false, bizId: '', bizName: '' })}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
