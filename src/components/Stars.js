import { useEffect, useRef } from 'react';
export default function Stars() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    let stars = [], id;
    const resize = () => {
      c.width = window.innerWidth; c.height = window.innerHeight;
      stars = Array.from({ length: 220 }, () => ({
        x: Math.random()*c.width, y: Math.random()*c.height,
        r: Math.random()*1.5+0.2, o: Math.random(), s: Math.random()*0.007+0.002
      }));
    };
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      stars.forEach(s => {
        s.o += s.s; if(s.o>1||s.o<0) s.s=-s.s;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(180,210,255,${s.o})`; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'fixed',top:0,left:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none' }} />;
}
