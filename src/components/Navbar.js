import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import s from './Navbar.module.css';

export default function Navbar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { isAuth, user, logout } = useAuth();

  const go = (path) => nav(path);
  const active = (path) => loc.pathname === path ? s.active : '';

  const handleLogout = () => { logout(); nav('/'); };

  return (
    <nav className={s.nav}>
      <div className={s.logo} onClick={() => go('/')}>🚀 SPACE AGENCY</div>
      <div className={s.links}>
        <span className={`${s.link} ${active('/')}`} onClick={() => go('/')}>Bosh sahifa</span>
        <span className={`${s.link} ${active('/planets')}`} onClick={() => go('/planets')}>Sayyoralar</span>
        <span className={`${s.link} ${active('/booking')}`} onClick={() => go('/booking')}>Bron qilish</span>
        {isAuth
          ? <>
              <span className={`${s.link} ${active('/account')}`} onClick={() => go('/account')}>
                👤 {user?.username || user?.email || 'Akkaunt'}
              </span>
              <button className={s.logoutBtn} onClick={handleLogout}>Chiqish</button>
            </>
          : <>
              <span className={`${s.link} ${active('/login')}`} onClick={() => go('/login')}>Kirish</span>
              <button className={s.registerBtn} onClick={() => go('/register')}>Ro'yxatdan o'tish</button>
            </>
        }
      </div>
    </nav>
  );
}
