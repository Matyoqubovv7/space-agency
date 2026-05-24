import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import s from './Auth.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async () => {
    if (!form.username || !form.password) { setError("Barcha maydonlarni to'ldiring"); return; }
    setLoading(true); setError('');
    try {
      await login(form);
      navigate('/account');
    } catch (e) {
      const msg = e?.non_field_errors?.[0] || e?.detail || "Login yoki parol noto'g'ri";
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.icon}>🚀</div>
        <h2 className={s.title}>Tizimga kirish</h2>
        <p className={s.sub}>Akkauntingizga kiring</p>
        {error && <div className={s.errorBox}>{error}</div>}
        <div className={s.field}>
          <label>Foydalanuvchi nomi</label>
          <input type="text" placeholder="username" value={form.username} onChange={e=>set('username',e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
        </div>
        <div className={s.field}>
          <label>Parol</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={e=>set('password',e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
        </div>
        <button className="btn-primary" style={{width:'100%',padding:'13px',borderRadius:'10px',marginTop:'0.5rem'}}
          onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ Kirilmoqda...' : 'Kirish'}
        </button>
        <p className={s.switchText}>
          Akkaunt yo'qmi? <span className={s.switchLink} onClick={()=>navigate('/register')}>Ro'yxatdan o'tish</span>
        </p>
      </div>
    </div>
  );
}
