import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import usePlanets from '../hooks/usePlanets';
import { createBooking } from '../api';
import s from './Booking.module.css';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='330' height='130'%3E%3Crect width='330' height='130' fill='%230d1b2a'/%3E%3Ctext x='165' y='72' text-anchor='middle' fill='%23374151' font-size='13' font-family='sans-serif'%3ESayyora tanlanmagan%3C/text%3E%3C/svg%3E";
const TODAY = new Date().toISOString().split('T')[0];

export default function Booking() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const { planets } = usePlanets();
  const location = useLocation();
  const [form, setForm] = useState({ first_name:'',last_name:'',email:'',phone:'',planet:'',passengers:1,travel_date:'',notes:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (location.state?.planetId) setForm(f=>({...f,planet:String(location.state.planetId)})); }, [location.state]);

  const selected = planets.find(p => String(p.id) === String(form.planet));
  const total = selected ? Math.round(Number(selected.price_per_ticket) * Number(form.passengers)) : 0;
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'Ism kiritish shart';
    if (!form.last_name.trim()) e.last_name = 'Familiya kiritish shart';
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "To'g'ri email kiriting";
    if (!form.phone.trim()) e.phone = 'Telefon kiritish shart';
    if (!form.planet) e.planet = 'Sayyora tanlash shart';
    if (!form.passengers || form.passengers < 1) e.passengers = "Kamida 1 yo'lovchi";
    if (selected && form.passengers > selected.capacity) e.passengers = `Maksimum ${selected.capacity} kishi`;
    if (!form.travel_date || new Date(form.travel_date) <= new Date()) e.travel_date = "Sana bugundan keyin bo'lishi kerak";
    return e;
  };

  const handleSubmit = async () => {
    if (!isAuth) { navigate('/login'); return; }
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    try {
      await createBooking({ ...form, planet: parseInt(form.planet), passengers: parseInt(form.passengers) });
      setSuccess(true);
    } catch (err) {
      setErrors({ global: "Bron qilishda xatolik yuz berdi. Qayta urinib ko'ring." });
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className={s.successPage}>
      <div style={{fontSize:'4rem',marginBottom:'1rem',animation:'pop .5s ease'}}>🎉</div>
      <h2 className={s.successTitle}>Tabriklaymiz!</h2>
      <p className={s.successSub}>Broningiz muvaffaqiyatli qabul qilindi.<br/>Tez orada email orqali tasdiqnoma yuboriladi.</p>
      <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center'}}>
        <button className="btn-primary" onClick={() => navigate('/account')}>Bronlarimni ko'rish</button>
        <button className="btn-outline" onClick={() => { setSuccess(false); setForm({first_name:'',last_name:'',email:'',phone:'',planet:'',passengers:1,travel_date:'',notes:''}); }}>Yangi bron</button>
      </div>
    </div>
  );

  return (
    <div className={s.page}>
      <div className={s.header}><h1>Bron qilish</h1><p>Kosmik sayohatingizni bron qiling</p></div>
      {!isAuth && <div className={s.authWarn}>⚠️ Bron qilish uchun <span onClick={()=>navigate('/login')}>tizimga kiring</span> yoki <span onClick={()=>navigate('/register')}>ro'yxatdan o'ting</span></div>}
      {errors.global && <div className={s.errBox} style={{maxWidth:980,margin:'0 auto 1rem'}}>{errors.global}</div>}
      <div className={s.layout}>
        <div className={s.formWrap}>
          <Row>
            <Field label="Ism *" err={errors.first_name}><input placeholder="Jasur" value={form.first_name} onChange={e=>set('first_name',e.target.value)} className={errors.first_name?s.inputErr:''}/></Field>
            <Field label="Familiya *" err={errors.last_name}><input placeholder="Karimov" value={form.last_name} onChange={e=>set('last_name',e.target.value)} className={errors.last_name?s.inputErr:''}/></Field>
          </Row>
          <Field label="Email *" err={errors.email}><input type="email" placeholder="jasur@email.com" value={form.email} onChange={e=>set('email',e.target.value)} className={errors.email?s.inputErr:''}/></Field>
          <Field label="Telefon *" err={errors.phone}><input type="tel" placeholder="+998 90 123 45 67" value={form.phone} onChange={e=>set('phone',e.target.value)} className={errors.phone?s.inputErr:''}/></Field>
          <Field label="Sayyora *" err={errors.planet}>
            <select value={form.planet} onChange={e=>set('planet',e.target.value)} className={errors.planet?s.inputErr:''}>
              <option value="">Sayyora tanlang...</option>
              {planets.map(p=><option key={p.id} value={String(p.id)}>{p.name} — ${Number(p.price_per_ticket).toLocaleString()}</option>)}
            </select>
          </Field>
          <Row>
            <Field label="Yo'lovchilar *" err={errors.passengers}><input type="number" min="1" max={selected?.capacity||99} value={form.passengers} onChange={e=>set('passengers',e.target.value)} className={errors.passengers?s.inputErr:''}/></Field>
            <Field label="Sayohat sanasi *" err={errors.travel_date}><input type="date" min={TODAY} value={form.travel_date} onChange={e=>set('travel_date',e.target.value)} className={errors.travel_date?s.inputErr:''}/></Field>
          </Row>
          <Field label="Maxsus istaklar"><textarea placeholder="Qo'shimcha talablar..." value={form.notes} onChange={e=>set('notes',e.target.value)}/></Field>
          <button className="btn-primary" style={{width:'100%',padding:'14px',fontSize:'.95rem',borderRadius:'12px'}} onClick={handleSubmit} disabled={loading}>
            {loading?'⏳ Yuborilmoqda...':'🚀 Bron qilish'}
          </button>
        </div>
        <div className={s.summary}>
          <div className={s.summaryTitle}>Sayohat xulosasi</div>
          <img className={s.summaryImg} src={selected?selected.image:PLACEHOLDER} alt={selected?.name||''} />
          <div className={s.summaryName}>{selected?.name||'—'}</div>
          <SRow l="Yo'lovchilar" v={form.passengers} />
          <SRow l="Bitta chipta" v={selected?`$${Number(selected.price_per_ticket).toLocaleString()}`:'—'} />
          <SRow l="Sana" v={form.travel_date||'—'} />
          <div className={s.summaryTotal}><span>Jami narx</span><span className={s.totalVal}>${total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}

const Row = ({children}) => <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>{children}</div>;
const Field = ({label,err,children}) => (
  <div style={{marginBottom:'1.1rem'}}>
    <label style={{display:'block',fontSize:'.75rem',color:'rgba(160,180,220,.6)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'5px',fontWeight:500}}>{label}</label>
    {children}
    {err && <span style={{fontSize:'.73rem',color:'#ff6b6b',marginTop:'3px',display:'block'}}>{err}</span>}
  </div>
);
const SRow = ({l,v}) => <div style={{display:'flex',justifyContent:'space-between',fontSize:'.8rem',color:'rgba(160,180,220,.6)',marginBottom:'.45rem'}}><span>{l}</span><strong style={{color:'#e0e8ff'}}>{v}</strong></div>;
