import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePlanets from '../hooks/usePlanets';
import PlanetCard from '../components/PlanetCard';
import Modal from '../components/Modal';
import s from './Planets.module.css';

const Skel = () => (
  <div className={s.skelCard}>
    <div className={`skeleton ${s.skelImg}`} />
    <div style={{padding:'1rem 1.2rem'}}>
      <div className="skeleton" style={{height:13,width:'55%',marginBottom:10}} />
      <div className="skeleton" style={{height:10,marginBottom:6}} />
      <div className="skeleton" style={{height:10,width:'75%',marginBottom:14}} />
      <div className="skeleton" style={{height:28,borderRadius:20,width:'45%'}} />
    </div>
  </div>
);

export default function Planets() {
  const { planets, loading, error, retry } = usePlanets();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [cap, setCap] = useState('');
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  const filtered = planets
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => cap==='small'?p.capacity<=5:cap==='medium'?p.capacity>=6&&p.capacity<=12:cap==='large'?p.capacity>12:true)
    .sort((a,b) => sort==='price-asc'?a.price_per_ticket-b.price_per_ticket:sort==='price-desc'?b.price_per_ticket-a.price_per_ticket:sort==='cap-asc'?a.capacity-b.capacity:0);

  return (
    <div className={s.page}>
      <div className={s.header}><h1>Sayyoralar</h1><p>10 ta ekzotik manzildan birini tanlang</p></div>
      <div className={s.filters}>
        <input placeholder="🔍  Sayyora qidirish..." value={search} onChange={e=>setSearch(e.target.value)} className={s.search} />
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Saralash...</option>
          <option value="price-asc">Narx ↑ arzondan</option>
          <option value="price-desc">Narx ↓ qimmatdan</option>
          <option value="cap-asc">Sig'im ↑</option>
        </select>
        <select value={cap} onChange={e=>setCap(e.target.value)}>
          <option value="">Barcha sig'imlar</option>
          <option value="small">Kichik (≤5)</option>
          <option value="medium">O'rta (6–12)</option>
          <option value="large">Katta (12+)</option>
        </select>
      </div>
      {loading && <div className={s.grid}>{Array(6).fill(0).map((_,i)=><Skel key={i}/>)}</div>}
      {error && <div className={s.empty}><span style={{fontSize:'2.8rem',opacity:.5}}>⚠️</span><p>{error}</p><button className="btn-outline" style={{marginTop:'1rem'}} onClick={retry}>Qayta urinish</button></div>}
      {!loading&&!error&&filtered.length===0&&<div className={s.empty}><span style={{fontSize:'2.8rem',opacity:.5}}>🔭</span><p>Sayyora topilmadi</p></div>}
      {!loading&&!error&&filtered.length>0&&(
        <div className={s.grid}>
          {filtered.map(p=><PlanetCard key={p.id} planet={p} onDetail={setModal} onBook={pl=>navigate('/booking',{state:{planetId:pl.id}})} />)}
        </div>
      )}
      {modal && <Modal planet={modal} onClose={()=>setModal(null)} />}
    </div>
  );
}
