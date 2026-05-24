import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyBookings } from '../api';
import s from './Account.module.css';

const STATUS_MAP = {
  pending:    { label: 'Kutilmoqda',   color: '#ffd700', bg: 'rgba(255,215,0,0.1)' },
  confirmed:  { label: 'Tasdiqlangan', color: '#00d4ff', bg: 'rgba(0,212,255,0.1)' },
  cancelled:  { label: 'Bekor qilingan', color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
  completed:  { label: 'Bajarilgan',   color: '#6fffb0', bg: 'rgba(111,255,176,0.1)' },
};

export default function Account() {
  const { user, logout, isAuth } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('bookings');

  useEffect(() => {
    if (!isAuth) { navigate('/login'); return; }
    loadBookings();
  }, [isAuth]);

  const loadBookings = async () => {
    setLoading(true); setError('');
    try { setBookings(await getMyBookings()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const totalSpent = bookings.reduce((sum, b) => {
    const price = b.planet?.price_per_ticket || b.total_price || 0;
    return sum + Number(price) * (b.passengers || 1);
  }, 0);

  return (
    <div className={s.page}>
      {/* PROFILE HEADER */}
      <div className={s.profileHeader}>
        <div className={s.avatar}>{(user?.username || user?.email || 'U')[0].toUpperCase()}</div>
        <div className={s.profileInfo}>
          <h1 className={s.profileName}>{user?.username || 'Foydalanuvchi'}</h1>
          <p className={s.profileEmail}>{user?.email || ''}</p>
        </div>
        <button className={s.logoutBtn} onClick={handleLogout}>Chiqish</button>
      </div>

      {/* STATS ROW */}
      <div className={s.statsRow}>
        <div className={s.statCard}>
          <span className={s.statVal}>{loading ? '...' : bookings.length}</span>
          <span className={s.statLbl}>Jami bronlar</span>
        </div>
        <div className={s.statCard}>
          <span className={s.statVal}>{loading ? '...' : bookings.filter(b=>b.status==='confirmed'||!b.status).length}</span>
          <span className={s.statLbl}>Tasdiqlangan</span>
        </div>
        <div className={s.statCard}>
          <span className={s.statVal}>{loading ? '...' : `$${totalSpent.toLocaleString()}`}</span>
          <span className={s.statLbl}>Umumiy xarajat</span>
        </div>
        <div className={s.statCard}>
          <span className={s.statVal}>{loading ? '...' : new Set(bookings.map(b=>b.planet?.id||b.planet)).size}</span>
          <span className={s.statLbl}>Sayyoralar</span>
        </div>
      </div>

      {/* TABS */}
      <div className={s.tabs}>
        <button className={`${s.tab} ${tab==='bookings'?s.tabActive:''}`} onClick={()=>setTab('bookings')}>🎫 Bronlarim</button>
        <button className={`${s.tab} ${tab==='profile'?s.tabActive:''}`} onClick={()=>setTab('profile')}>👤 Profil</button>
      </div>

      {/* BOOKINGS TAB */}
      {tab === 'bookings' && (
        <div>
          <div className={s.bookingsHeader}>
            <span>{loading?'':`${bookings.length} ta bron topildi`}</span>
            <button className={s.newBronBtn} onClick={()=>navigate('/booking')}>+ Yangi bron</button>
          </div>

          {loading && (
            <div className={s.bookingsList}>
              {Array(3).fill(0).map((_,i)=>(
                <div key={i} className={s.skelBron}>
                  <div className="skeleton" style={{width:100,height:80,borderRadius:10,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div className="skeleton" style={{height:14,width:'40%',marginBottom:10}}/>
                    <div className="skeleton" style={{height:10,width:'60%',marginBottom:6}}/>
                    <div className="skeleton" style={{height:10,width:'30%'}}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <div className={s.errBox}>⚠️ {error} <button className={s.retryBtn} onClick={loadBookings}>Qayta</button></div>}

          {!loading && !error && bookings.length === 0 && (
            <div className={s.empty}>
              <span style={{fontSize:'3rem',opacity:.4}}>🚀</span>
              <p>Hali hech qanday bron yo'q</p>
              <button className="btn-primary" style={{marginTop:'1rem'}} onClick={()=>navigate('/booking')}>Birinchi bronni qilish</button>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className={s.bookingsList}>
              {bookings.map((b, i) => {
                const planet = b.planet_detail || b.planet_info || b.planet;
                const planetName = typeof planet === 'object' ? planet?.name : `Sayyora #${planet}`;
                const planetImg = typeof planet === 'object' ? planet?.image : null;
                const price = b.total_price || (typeof planet==='object' ? Number(planet?.price_per_ticket)*(b.passengers||1) : 0);
                const st = STATUS_MAP[b.status] || STATUS_MAP['pending'];
                return (
                  <div key={b.id || i} className={s.bronCard}>
                    {planetImg
                      ? <img src={planetImg} alt={planetName} className={s.bronImg}/>
                      : <div className={s.bronImgPlaceholder}>{(planetName||'?')[0]}</div>
                    }
                    <div className={s.bronInfo}>
                      <div className={s.bronTop}>
                        <span className={s.bronPlanet}>{planetName || '—'}</span>
                        <span className={s.bronStatus} style={{color:st.color,background:st.bg}}>{st.label}</span>
                      </div>
                      <div className={s.bronMeta}>
                        {b.travel_date && <span>📅 {b.travel_date}</span>}
                        {b.passengers && <span>👥 {b.passengers} kishi</span>}
                        {(b.first_name || b.last_name) && <span>👤 {b.first_name} {b.last_name}</span>}
                      </div>
                      {price > 0 && <div className={s.bronPrice}>${Number(price).toLocaleString()}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {tab === 'profile' && (
        <div className={s.profileTab}>
          <div className={s.profileCard}>
            <h3 className={s.profileCardTitle}>Akkaunt ma'lumotlari</h3>
            <div className={s.profileRow}><span className={s.profileKey}>Foydalanuvchi nomi</span><span className={s.profileVal}>{user?.username || '—'}</span></div>
            <div className={s.profileRow}><span className={s.profileKey}>Email</span><span className={s.profileVal}>{user?.email || '—'}</span></div>
            <div className={s.profileRow}><span className={s.profileKey}>Maqom</span><span style={{color:'#6fffb0',fontSize:'.82rem'}}>✓ Faol akkaunt</span></div>
          </div>
          <div className={s.dangerZone}>
            <h3 className={s.dangerTitle}>Xavfli zona</h3>
            <p className={s.dangerSub}>Tizimdan chiqish uchun quyidagi tugmani bosing</p>
            <button className={s.logoutBtnLarge} onClick={handleLogout}>Tizimdan chiqish</button>
          </div>
        </div>
      )}
    </div>
  );
}
