import s from './PlanetCard.module.css';
export default function PlanetCard({ planet, onDetail, onBook }) {
  return (
    <div className={s.card} onClick={() => onDetail(planet)}>
      <div className={s.imgWrap}>
        <img src={planet.image} alt={planet.name} loading="lazy" />
        <div className={s.overlay} />
        <span className={s.name}>{planet.name}</span>
      </div>
      <div className={s.body}>
        <div className={s.meta}>
          <span className={s.dist}>📍 {planet.distance_from_earth}</span>
          <span className={s.cap}>👥 {planet.capacity}</span>
        </div>
        <p className={s.desc}>{planet.description}</p>
        <div className={s.footer}>
          <span className={s.price}>${Number(planet.price_per_ticket).toLocaleString()}</span>
          <div className={s.btns}>
            <button className={`${s.btn} ${s.outline}`} onClick={e=>{e.stopPropagation();onDetail(planet);}}>Batafsil</button>
            <button className={`${s.btn} ${s.filled}`} onClick={e=>{e.stopPropagation();onBook(planet);}}>Bron</button>
          </div>
        </div>
      </div>
    </div>
  );
}
