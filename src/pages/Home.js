import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Home.module.css';

function useCountUp(ref, target, special) {
  useEffect(() => {
    let cur = 0; const step = target / 60;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { clearInterval(t); if (ref.current) ref.current.textContent = special || Math.round(target); return; }
      if (ref.current) ref.current.textContent = Math.round(cur);
    }, 1400/60);
    return () => clearInterval(t);
  }, []);
}

export default function Home() {
  const nav = useNavigate();
  const r1=useRef(), r2=useRef(), r3=useRef(), r4=useRef();
  useCountUp(r1, 10, '10');
  useCountUp(r2, 500, '500+');
  useCountUp(r3, 49, '4.9 ★');
  useCountUp(r4, 24, '24/7');

  return (
    <div className={s.hero}>
      <div className={s.badge}>✦ Kosmik sayohat agentligi №1</div>
      <h1 className={s.title}>KOINOTNI<br /><span>KASHF ET</span></h1>
      <p className={s.sub}>
        Birinchi kosmik sayohat agentligi — Marsdan Plutongacha,<br />
        orzuingizni haqiqatga aylantiramiz. 10 ta manzil, cheksiz imkoniyatlar.
      </p>
      <div className={s.btns}>
        <button className="btn-primary" onClick={() => nav('/planets')}>Sayyoralarni ko'rish</button>
        <button className="btn-outline" onClick={() => nav('/booking')}>Hozir bron qilish</button>
      </div>
      <div className={s.stats}>
        {[{r:r1,l:'Manzil'},{r:r2,l:"Muvaffaqiyatli sayohat"},{r:r3,l:'Mijoz bahosi'},{r:r4,l:"Qo'llab-quvvatlash"}].map((x,i)=>(
          <div key={i} className={s.statItem}>
            <span className={s.statNum} ref={x.r}>0</span>
            <span className={s.statLabel}>{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
