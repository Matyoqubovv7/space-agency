import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Modal.module.css';

export default function Modal({ planet, onClose }) {
  const navigate = useNavigate();
  useEffect(() => { document.body.style.overflow='hidden'; return () => { document.body.style.overflow=''; }; }, []);
  if (!planet) return null;
  return (
    <div className={s.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div className={s.modal}>
        <button className={s.close} onClick={onClose}>✕</button>
        <img src={planet.image} alt={planet.name} className={s.img} />
        <div className={s.body}>
          <h2 className={s.title}>{planet.name}</h2>
          <div className={s.meta}>
            <span>📍 <strong>{planet.distance_from_earth}</strong></span>
            <span>👥 Sig'im: <strong>{planet.capacity} kishi</strong></span>
          </div>
          <p className={s.desc}>{planet.description}</p>
          <div className={s.priceRow}>
            <span className={s.priceLabel}>Bitta chipta narxi</span>
            <span className={s.priceVal}>${Number(planet.price_per_ticket).toLocaleString()}</span>
          </div>
          <button className="btn-primary" style={{width:'100%',padding:'13px',borderRadius:'10px'}}
            onClick={() => { onClose(); navigate('/booking', { state: { planetId: planet.id } }); }}>
            🚀 Hozir bron qilish
          </button>
        </div>
      </div>
    </div>
  );
}
