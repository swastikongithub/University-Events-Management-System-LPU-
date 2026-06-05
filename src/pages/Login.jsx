import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function Login() {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const containerRef = useRef(null);
  
  useGSAP(() => {
    gsap.from('.login-box', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
    gsap.from('.lpu-logo', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'back.out(1.5)'
    });
  }, { scope: containerRef });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(regNo, password);
      // Route based on role
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'organizer') navigate('/organizer');
      else if (user.role === 'teacher') navigate('/teacher');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demoId) => {
    setRegNo(demoId);
    setPassword('password');
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-[#F5F6F8]">
      <div className="login-box w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="lpu-logo inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FCA24E] text-white font-bold text-2xl mb-4 shadow-md">
            LPU
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin & Staff Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in with your Staff ID</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Staff ID</label>
            <input 
              type="text" 
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="ums-input"
              placeholder="e.g. EMP001"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ums-input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-[#FCA24E] hover:bg-[#E5872E] text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-semibold mb-3 text-center uppercase tracking-wider">Demo Access</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => handleDemoClick('ORG001')} className="text-sm py-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors">
              Organizer Demo
            </button>
            <button type="button" onClick={() => handleDemoClick('EMP001')} className="text-sm py-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors">
              Teacher Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
