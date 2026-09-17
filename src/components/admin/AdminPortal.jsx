import React, { useState, useEffect } from 'react';
import { Shield, Key, Search, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const AdminPortal = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [config, setConfig] = useState(null);
  const [liveModels, setLiveModels] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) fetchConfig();
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
        toast.success('Logged in successfully');
      } else {
        toast.error('Invalid password');
      }
    } catch (e) {
      toast.error('Login failed');
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.providerModels);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleProbe = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/probe`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLiveModels(data.liveModels);
        toast.success('Probed active models from providers');
      }
    } catch (e) {
      toast.error('Failed to probe models');
    }
    setIsLoading(false);
  };

  const toggleModel = (provider, model) => {
    if (!config) return;
    const current = config[provider] || [];
    let updated;
    if (current.includes(model)) {
      updated = current.filter(m => m !== model);
    } else {
      updated = [...current, model];
    }
    setConfig({ ...config, [provider]: updated });
  };

  const saveConfig = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/config`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ providerModels: config })
      });
      if (res.ok) {
        toast.success('Configuration saved safely');
      } else {
        toast.error('Failed to save config');
      }
    } catch (e) {
      toast.error('Error saving config');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
          <div className="flex justify-center mb-6">
            <Shield className="size-12 text-[#FF4D4D]" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]/20 transition-all"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="size-8 text-[#FF4D4D]" />
            <h1 className="text-3xl font-extrabold text-slate-900">System Configuration</h1>
          </div>
          <button 
            onClick={() => { setToken(''); localStorage.removeItem('admin_token'); }}
            className="text-sm font-bold text-slate-500 hover:text-slate-900"
          >
            Lock Vault
          </button>
        </header>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Active AI Models</h2>
              <p className="text-sm text-slate-500 mt-1">Probe providers and tick models to use for generation.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleProbe} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold transition-all">
                {isLoading ? <RefreshCw className="size-4 animate-spin" /> : <Search className="size-4" />}
                Probe Live Models
              </button>
              <button onClick={saveConfig} className="flex items-center gap-2 px-5 py-2.5 bg-[#FF4D4D] hover:bg-[#ff3333] text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20">
                <CheckCircle className="size-4" />
                Save Active Models
              </button>
            </div>
          </div>

          {!liveModels && (
            <div className="text-center py-12 text-slate-400">
              <Key className="size-12 mx-auto mb-4 opacity-20" />
              <p>Click "Probe Live Models" to fetch real-time endpoints.</p>
            </div>
          )}

          {liveModels && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(liveModels).map(([provider, models]) => (
                <div key={provider} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 capitalize flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500"></span>
                    {provider}
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 max-h-[300px] overflow-y-auto">
                    {models.map(model => {
                      const isActive = config?.[provider]?.includes(model);
                      return (
                        <label key={model} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            checked={isActive} 
                            onChange={() => toggleModel(provider, model)}
                            className="w-5 h-5 rounded border-slate-300 text-[#FF4D4D] focus:ring-[#FF4D4D]"
                          />
                          <span className={`text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                            {model}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
