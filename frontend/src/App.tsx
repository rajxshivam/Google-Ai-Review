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
  BarChart3
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface AuthUser {
  _id: string;
  email: string;
  role: 'admin' | 'merchant';
  businessId?: string;
}

interface LoginPageProps {
  login: (email: string, password: string) => Promise<boolean>;
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
    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      showToast('Invalid email or password.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={28} color="var(--accent)" />
            <h1 style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em' }}><span style={{ color: 'var(--accent)' }}>AI</span> Reviews</h1>
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
            <h1 style={{ fontWeight: 700, fontSize: '1.5rem' }}><span style={{ color: 'var(--accent)' }}>AI</span> Reviews</h1>
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
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
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
        return true;
      }
      return false;
    } catch {
      return false;
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
  const [businessId, setBusinessId] = useState<string>(() => localStorage.getItem('review_biz_id') || '');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Restaurant');
  const [context, setContext] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [qrColor, setQrColor] = useState('#6C63FF');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [scansToday, setScansToday] = useState(0);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      }
    } catch (err) {
      console.error('Could not fetch business details from server, using demo state.', err);
    }
  };

  const fetchFeedbacks = async (id: string) => {
    setLoadingFeedbacks(true);
    try {
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
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
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
      localStorage.setItem(`demo_biz_${mockId}`, JSON.stringify({ name, category, context, googleReviewUrl }));
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
      <div className="qr-flyer-print">
        <h1>Leave Us A Review!</h1>
        <p>Your feedback helps us grow. Scan the QR code below and select your stars.</p>
        <div className="qr-box">
          <QRCodeSVG value={getCustomerLink()} size={280} level="H" />
        </div>
        <p style={{ marginTop: '3rem', fontWeight: 600, fontSize: '1.25rem' }}>Thank You For Supporting {name || 'Our Business'}!</p>
      </div>

      <div className="merchant-layout">
        {/* Sidebar */}
        <aside className="merchant-sidebar">
          <div className="sidebar-logo" onClick={() => navigateTo('/admin')}>
            <Sparkles size={22} />
            <span>AI</span> Reviews
          </div>
          <div className="sidebar-header">
            <h3>{name || 'Your Business'}</h3>
            <p>{category}</p>
          </div>
          <nav className="sidebar-nav">
            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
              <Sparkles size={16} /> Overview
            </button>
            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
              <Settings size={16} /> Business Profile
            </button>
            <button className={activeTab === 'qr' ? 'active' : ''} onClick={() => setActiveTab('qr')}>
              <QrCode size={16} /> Review QR Code
            </button>
            <button className={activeTab === 'feedbacks' ? 'active' : ''} onClick={() => setActiveTab('feedbacks')}>
              <MessageSquare size={16} /> Customer Reviews
            </button>
            <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
              <BarChart3 size={16} /> Analytics
            </button>
            <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
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
              <button className="btn btn-outline btn-sm" onClick={logout} style={{ width: '100%', fontSize: '0.8125rem' }}>
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
            <div className="card fade-in">
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={20} color="var(--accent)" /> Configure Business Settings
              </h2>
              <form onSubmit={handleSaveProfile}>
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
                  <label className="form-label">AI Prompt Context (Tell AI about your business)</label>
                  <textarea 
                    className="form-textarea" 
                    value={context} 
                    onChange={(e) => setContext(e.target.value)} 
                    placeholder="Provide context like: Cozy Italian pizza shop famous for wood-fired pepperoni pizza, friendly service, and a beautiful outdoor patio. We want reviews to focus on friendly staff, fast service, and fresh ingredients." 
                    required 
                  />
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

                <button type="submit" className="btn btn-accent" disabled={isSubmitting} style={{ width: '100%' }}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                      Saving details...
                    </>
                  ) : 'Save & Generate Review QR'}
                </button>
              </form>
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
                    <QRCodeSVG id="qr-code-svg" value={getCustomerLink()} size={200} level="H" fgColor={qrColor} bgColor={qrBgColor} />
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

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scans Today</span>
                  <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700 }}>{scansToday}</span>
                </div>
                <div style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Reviews</span>
                  <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700 }}>{feedbacks.length}</span>
                </div>
              </div>

              {feedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                  <ThumbsUp size={36} style={{ strokeWidth: 1.5, marginBottom: '1rem', color: 'var(--text-tertiary)' }} />
                  <p>No reviews received yet. Share your QR code to get started!</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="feedback-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Rating</th>
                        <th>Review Details</th>
                        <th>Mobile Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((fb) => (
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
                          <td style={{ maxWidth: '400px' }}>{fb.feedbackText}</td>
                          <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {fb.customerContact || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Not provided</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                          {[1,2,3,4,5].map((_, index) => (
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
  const [reviews, setReviews] = useState<string[]>([]);
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
      );
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

  const handleCopyAndRedirect = async (text: string, idx: number) => {
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
          customerContact: contact || ''
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
              className={`star-button ${
                (hoverRating || rating) >= stars ? 'active' : ''
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
                {reviews.map((text, idx) => (
                  <div 
                    key={idx}
                    className={`review-card ${selectedReviewIdx === idx ? 'selected' : ''}`}
                    onClick={() => handleCopyAndRedirect(text, idx)}
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
                ))}
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
  const [revenueData, setRevenueData] = useState<{ totalRevenue: number; activeSubscriptions: number; planCounts: any; monthlyRevenue: any[] } | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subModal, setSubModal] = useState<{ show: boolean; bizId: string; bizName: string }>({ show: false, bizId: '', bizName: '' });
  const [subPlan, setSubPlan] = useState('yearly');
  const [subPaymentMethod, setSubPaymentMethod] = useState('UPI');
  const [subTxnId, setSubTxnId] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

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

      const revRes = await fetch(`${API_BASE}/admin/revenue`, { credentials: 'include', headers: getAuthHeaders() });
      const subRes = await fetch(`${API_BASE}/admin/subscriptions`, { credentials: 'include', headers: getAuthHeaders() });
      if (revRes.ok) setRevenueData(await revRes.json());
      if (subRes.ok) setSubscriptions(await subRes.json());
    } catch (err) {
      console.error('Failed to load admin data from API.', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (biz: any) => {
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
        showToast(`Business ${updated.isApproved ? 'Approved' : 'Suspended'}!`);
      }
    } catch (err) {
      console.error(err);
      setBusinesses(prev => prev.map(b => {
        if (b._id === biz._id) return { ...b, isApproved: !b.isApproved };
        return b;
      }));
      showToast('Offline mode: Toggled approval status locally.');
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
  const handleApproveRegistration = async (reg: any) => {
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${reg._id}/approve`, {
        method: 'PUT', credentials: 'include', headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast(`Registration approved! Business created.`);
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
      const res = await fetch(`${API_BASE}/admin/subscribe`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include',
        body: JSON.stringify({ businessId: subModal.bizId, plan: subPlan, paymentMethod: subPaymentMethod, transactionId: subTxnId })
      });
      if (res.ok) {
        showToast('Subscription activated!');
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
          <span>AI</span> Reviews
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{user.email}</span>
          <button className="btn btn-outline" onClick={logout} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            Logout
          </button>
          <div className="copy-badge" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
            <Shield size={16} /> Super Admin
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
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
                      </td>
                      <td>
                        <button 
                          className={`btn ${biz.isApproved ? 'btn-secondary' : 'btn-accent'}`}
                          onClick={() => handleToggleApprove(biz)}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minWidth: '100px' }}
                        >
                          {biz.isApproved ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)' }}>
                              <CheckCircle size={12} /> Approved
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <XCircle size={12} /> Pending
                            </span>
                          )}
                        </button>
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
                          <button className="btn btn-outline" onClick={() => handleDeleteBusiness(biz._id)} style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }} title="Delete Business">
                            <Trash2 size={12} />
                          </button>
                          <button className="btn btn-accent" onClick={() => setSubModal({ show: true, bizId: biz._id, bizName: biz.name })} style={{ padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem' }} title="Assign Plan">
                            ₹
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

          {registrations.length === 0 ? (
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
                  {registrations.map(reg => (
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
                            <button className="btn btn-accent" onClick={() => handleApproveRegistration(reg)}
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                              <CheckCircle size={12} /> Approve
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
              <label className="form-label">AI Prompt Context (Tell AI about the business)</label>
              <textarea className="form-textarea" value={context} onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Cozy Italian pizza shop famous for wood-fired pizza and friendly staff." required />
            </div>

            <div className="form-group">
              <label className="form-label">SEO Keywords (comma-separated)</label>
              <input type="text" className="form-input" value={keywords} onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. best pizza mumbai, italian restaurant, wood fired pizza" />
            </div>

            {!editingId && (
              <div style={{ borderTop: '1px solid var(--border)', margin: '1.5rem 0', paddingTop: '1.5rem' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>MERCHANT ACCOUNT</p>
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

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2rem 0' }}>
              <input type="checkbox" id="isApproved" checked={isApproved} onChange={(e) => setIsApproved(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="isApproved" style={{ fontWeight: 500, fontSize: '0.9375rem', cursor: 'pointer' }}>
                Approve and Activate this business portal immediately
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                {editingId ? 'Save Profile Changes' : 'Register & Setup Business'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
              )}
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
                      <td>{fb.feedbackText}</td>
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
          <h3 style={{ marginBottom: '1.5rem' }}>Revenue & Subscription Plans</h3>

          {revenueData && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
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
                <h4 style={{ marginBottom: '1rem' }}>Monthly Revenue (Last 6 Months)</h4>
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
                          {sub.plan}
                        </span>
                      </td>
                      <td>₹{sub.amount.toLocaleString('en-IN')}</td>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Plan Pricing</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '2px solid var(--accent)' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--accent)' }}>Yearly</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹4,999<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/yr</span></p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Valid for 1 year from activation</p>
              </div>
              <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '2px solid var(--warning)' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--warning)' }}>Lifetime</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹9,999</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>One-time payment, no expiry</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigateTo('/admin')} style={{ fontSize: '0.75rem' }}>
          Go to Merchant view
        </button>
      </div>

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
            <h3 style={{ marginBottom: '1.5rem' }}>Assign Plan: {subModal.bizName}</h3>

            <div className="form-group">
              <label className="form-label">Select Plan</label>
              <select className="form-select" value={subPlan} onChange={(e) => setSubPlan(e.target.value)}>
                <option value="yearly">Yearly (₹4,999/yr)</option>
                <option value="lifetime">Lifetime (₹9,999 one-time)</option>
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
              <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleSubscribe}>Activate Plan</button>
              <button className="btn btn-secondary" onClick={() => setSubModal({ show: false, bizId: '', bizName: '' })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
