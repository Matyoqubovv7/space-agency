import { useState, useEffect } from 'react';
import { getPlanets } from '../api';

export default function usePlanets() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { setPlanets(await getPlanets()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  return { planets, loading, error, retry: load };
}
