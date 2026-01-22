import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo-umb.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, DEMO_USERS } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) return;
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) setLoginError('');
  };

  const handleDemoLogin = async (email) => {
    const user = DEMO_USERS[email];
    if (user) {
      setFormData({ email, password: user.password });
      try {
        await login(email, user.password);
        navigate('/dashboard');
      } catch (error) {
        setLoginError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
              <img src={logo} alt="UMB Bank Logo" className="w-20 h-20" />
            </div>
            <div className="flex flex-col gap-2">
  <h1 className="text-5xl font-black">
  <span className="text-white italic [text-shadow:0_0_10px_rgba(255,255,255,0.3)]">Speed</span>
  <span className="text-amber-400 not-italic [text-shadow:0_0_15px_rgba(245,158,11,0.5)]">Procure</span>
</h1>
<p className="text-amber-500 text-2xl font-bold">Universal Merchant Bank</p>
</div>

          </div>

          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
  Smart, Secure<br />Procurement
</h2>

<p className="text-slate-400 text-lg max-w-md mb-12">
  A digital procurement engine that accelerates approvals, enhances
  visibility, and ensures full policy compliance across your organization.
</p>


          {/* Features */}
          <div className="space-y-4">
            {[
              'Automated approval workflows',
              'Real-time tracking & notifications',
              'Compliance verification',
              'Vendor management'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-slate-600/20 rounded-full blur-2xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
<div className="lg:hidden flex items-center justify-center gap-3 mb-8">
  <div className="w-10 h-10 rounded-lg bg-white/90 flex items-center justify-center shadow-lg">
    <img
      src={logo}
      alt="UMB Bank Logo"
      className="w-10 h-10 object-contain"
    />
  </div>

  <div className="flex flex-col">
    <h1 className="text-2xl font-black leading-tight">
      <span className="text-white italic [text-shadow:0_0_6px_rgba(255,255,255,0.4)]">
        Speed
      </span>
      <span className="text-amber-400 ml-1 [text-shadow:0_0_10px_rgba(245,158,11,0.6)]">
        Procure
      </span>
    </h1>

    <p className="text-xs text-amber-400 font-semibold tracking-wide">
      UMB Procurement Platform
    </p>
  </div>
</div>


          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h3>
              <p className="text-slate-500">Sign in to your account to continue</p>
            </div>

            {loginError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-slate-200 focus:border-amber-500 bg-slate-50'
                    }`}
                    placeholder="you@umb.com.gh"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-slate-200 focus:border-amber-500 bg-slate-50'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8">
              <button
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-2"
              >
                <span>Demo Accounts for Testing</span>
                <svg className={`w-4 h-4 transition-transform ${showDemoAccounts ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDemoAccounts && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-3">Click any account to auto-login:</p>
                  <div className="space-y-2">
                    {Object.entries(DEMO_USERS).map(([email, user]) => (
                      <button
                        key={email}
                        onClick={() => handleDemoLogin(email)}
                        className="w-full p-3 text-left bg-white rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-slate-700 group-hover:text-amber-700">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                          </div>
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-500">
            © 2026 UMB Bank Ghana Limited. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
