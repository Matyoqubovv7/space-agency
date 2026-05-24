import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import s from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'', email:'', password:'', password2:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalErr, setGlobalErr] = useState('');

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username kiritish shart";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "To'g'ri email kiriting";
    if (form.password.length < 6) e.password = "Parol kamida 6 ta belgi";
    if (form.password !== form.password2) e.password2 = "Parollar mos emas";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({}); setGlobalErr(''); setLoading(true);
    try {
      await register({ username: form.username, email: form.email, password: form.password, password2: form.password2 });
      navigate('/account');
    } catch (err) {
      const first = Object.values(err)?.[0];
      setGlobalErr(Array.isArray(first) ? first[0] : (err?.detail || "Ro'yxatdan o'tishda xatolik"));
    } finally { setLoading(false); }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.icon}>👤</div>
        <h2 className={s.title}>Ro'yxatdan o'tish</h2>
        <p className={s.sub}>Yangi akkaunt yarating</p>
        {globalErr && <div className={s.errorBox}>{globalErr}</div>}
        {[
          { k:'username', label:'Foydalanuvchi nomi', type:'text', ph:'jasur_uz' },
          { k:'email', label:'Email', type:'email', ph:'jasur@email.com' },
          { k:'password', label:'Parol', type:'password', ph:'••••••••' },
          { k:'password2', label:'Parolni tasdiqlang', type:'password', ph:'••••••••' },
        ].map(f=>(
          <div key={f.k} className={s.field}>
            <label>{f.label}</label>
            <input type={f.type} placeholder={f.ph} value={form[f.k]}
              onChange={e=>set(f.k,e.target.value)}
              style={errors[f.k]?{borderColor:'rgba(255,90,90,0.6)'}:{}} />
            {errors[f.k] && <span className={s.fieldErr}>{errors[f.k]}</span>}
          </div>
        ))}
        <button className="btn-primary" style={{width:'100%',padding:'13px',borderRadius:'10px',marginTop:'0.5rem'}}
          onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
        </button>
        <p className={s.switchText}>
          Akkaunt bormi? <span className={s.switchLink} onClick={()=>navigate('/login')}>Kirish</span>
        </p>
      </div>
    </div>
  );
}
