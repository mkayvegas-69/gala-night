/* ═════════════════════════════════
   PARTICLE SYSTEM
═════════════════════════════════ */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomParticle(){
  return {
    x: Math.random()*W,
    y: Math.random()*H,
    r: Math.random()*1.4 + .3,
    vx: (Math.random()-.5)*.3,
    vy: (Math.random()-.5)*.3,
    alpha: Math.random()*.6 + .1,
    pulse: Math.random()*Math.PI*2,
    pulseSpeed: Math.random()*.02 + .005
  };
}

for(let i=0; i<140; i++) particles.push(randomParticle());

function drawParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p => {
    p.pulse += p.pulseSpeed;
    const a = p.alpha * (.6 + .4*Math.sin(p.pulse));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(201,168,76,${a})`;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0 || p.x > W) p.vx *= -1;
    if(p.y < 0 || p.y > H) p.vy *= -1;
  });
  // Draw connections
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 120){
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(201,168,76,${.06*(1-dist/120)})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

const advertCaptions = ['Grand Ballroom','Gala Dinner','Live Entertainment','Award Ceremony','Champagne Reception','The Stage','Distinguished Guests','After Midnight'];
const galleryLabels = ['The Grand Ballroom','Candlelit Tables','Live Orchestra','Reception Hall','Champagne Toast','Award Ceremony','Distinguished Guests','The Dance Floor','Floral Arrangements','Chef\'s Table','Opening Remarks','A Night to Remember','The Grand Finale'];

function initAdvertCards(){
  const track = document.getElementById('advertTrack');
  if(!track) return;
  track.innerHTML = '';
  for(let i=0;i<16;i++){
    const idx = i % 8;
    const card = document.createElement('div');
    card.className = 'advert-card';
    card.innerHTML = `
      <span class="advert-num">0${idx+1}</span>
      <div class="img-slot" id="slot-${i}">
        <input type="file" accept="image/*">
        <div class="slot-icon"><svg fill="none" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
        <span class="slot-txt">Upload Photo</span>
      </div>
      <div class="advert-overlay"><span class="advert-cap">${advertCaptions[idx]}</span></div>
    `;
    const input = card.querySelector('input');
    input.addEventListener('change', e => handleAdvertImg(e.target, i));
    track.appendChild(card);
  }
}

function initGalleryGrid(){
  const grid = document.getElementById('galleryGrid');
  if(!grid) return;
  grid.innerHTML = '';
  for(let i=0;i<13;i++){
    const cell = document.createElement('div');
    cell.className = 'g-cell';
    const imageMarkup = i===0 ? '<img src="Gala-Dinner-Photo-ICC-Sydney.-Photography-by-orlandosydney.com-OS2_6053-1200x801.jpg" alt="The Grand Ballroom" class="g-img">' : '';
    cell.innerHTML = `
      <div class="g-num">0${i<9?i+1:''}${i>=9?i+1:''}</div>
      ${imageMarkup}
      <div class="g-upload">
        <input type="file" accept="image/*">
        <svg fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span>Upload Image</span>
      </div>
      <div class="g-label"><span>${galleryLabels[i]}</span></div>
    `;
    const input = cell.querySelector('input');
    input.addEventListener('change', e => handleGalleryImg(e.target, i));
    const img = cell.querySelector('img.g-img');
    if(img){
      img.addEventListener('click',()=>{
        document.getElementById('lightbox-img').src = img.src;
        document.getElementById('lightbox').classList.add('open');
      });
    }
    grid.appendChild(cell);
  }
}

function initDynamicContent(){
  initAdvertCards();
  initGalleryGrid();
}

/* ═════════════════════════════════
   CURSOR
═════════════════════════════════ */
initDynamicContent();
const cur = document.getElementById('cur');
const curRing = document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
});
(function animCursor(){
  rx+=(mx-rx)*.1;ry+=(my-ry)*.1;
  curRing.style.left=rx+'px';curRing.style.top=ry+'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a,button,.astat,.advert-card,.g-cell,.contact-card,.seat-type,.prog-tab').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});

/* ═════════════════════════════════
   PRELOADER
═════════════════════════════════ */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('preloader').classList.add('done');
    initScrollReveal();
  },2600);
});

/* ═════════════════════════════════
   COUNTDOWN
═════════════════════════════════ */
const target = new Date('2026-07-06T18:00:00');
let prevSeconds = null;
function updateCd(){
  const now = new Date();
  const diff = target - now;
  if(diff<=0){document.getElementById('countdown').innerHTML='<div style="font-family:Cormorant Garamond,serif;font-style:italic;color:var(--gold);font-size:2rem;">The evening has arrived!</div>';return;}
  const d=Math.floor(diff/86400000);
  const h=Math.floor((diff%86400000)/3600000);
  const m=Math.floor((diff%3600000)/60000);
  const s=Math.floor((diff%60000)/1000);
  document.getElementById('cd-d').textContent=String(d).padStart(2,'0');
  document.getElementById('cd-h').textContent=String(h).padStart(2,'0');
  document.getElementById('cd-m').textContent=String(m).padStart(2,'0');
  const secondsEl = document.getElementById('cd-s');
  secondsEl.textContent = String(s).padStart(2,'0');
  if(prevSeconds !== null && s !== prevSeconds){
    secondsEl.classList.remove('animate');
    void secondsEl.offsetWidth;
    secondsEl.classList.add('animate');
  }
  prevSeconds = s;
}
updateCd();setInterval(updateCd,1000);

/* ═════════════════════════════════
   NAVBAR SCROLL
═════════════════════════════════ */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>60);
});

/* ═════════════════════════════════
   PAGE NAVIGATION
═════════════════════════════════ */
const pages = ['home','about','gallery','schedule','rsvp','contact'];
function goto(id){
  const curtain = document.getElementById('page-curtain');
  curtain.classList.add('entering');
  setTimeout(()=>{
    pages.forEach(p=>{
      document.getElementById('p-'+p).classList.remove('active');
    });
    document.getElementById('p-'+id).classList.add('active');
    window.scrollTo(0,0);
    curtain.classList.remove('entering');
    curtain.classList.add('leaving');
    setTimeout(()=>curtain.classList.remove('leaving'),600);
    document.querySelectorAll('.nav-links a').forEach(a=>{
      a.classList.toggle('active', a.dataset.page===id);
    });
    initScrollReveal();
    initCounters();
  },520);
}

/* ═════════════════════════════════
   SCROLL REVEAL
═════════════════════════════════ */
function initScrollReveal(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}
    });
  },{threshold:.1});
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-scale,.tm-item').forEach(el=>{
    el.classList.remove('in');
    obs.observe(el);
  });
}
setTimeout(initScrollReveal,2800);

/* ═════════════════════════════════
   NUMBER COUNTERS
═════════════════════════════════ */
function initCounters(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el = e.target;
      const end = parseInt(el.dataset.target);
      const suffix = el.textContent.replace(/\d+/,'').trim();
      let cur2=0;
      const step=Math.ceil(end/50);
      const iv=setInterval(()=>{
        cur2=Math.min(cur2+step,end);
        el.textContent=cur2+(end===1?'':'+')||cur2;
        if(cur2>=end)clearInterval(iv);
      },30);
      obs.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('[data-target]').forEach(el=>obs.observe(el));
}
setTimeout(initCounters,2800);

/* ═════════════════════════════════
   PROGRAMME TABS
═════════════════════════════════ */
function switchTab(el, panelId){
  document.querySelectorAll('.prog-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.prog-panel').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById(panelId);
  panel.classList.add('active');
  panel.querySelectorAll('.tm-item').forEach((item,i)=>{
    item.classList.remove('in');
    setTimeout(()=>item.classList.add('in'),i*100);
  });
}

/* ═════════════════════════════════
   IMAGE HANDLERS
═════════════════════════════════ */
function handleImg(input){
  const file = input.files[0];
  if(!file)return;
  const reader = new FileReader();
  reader.onload = e=>{
    const zone = input.closest('.img-upload-zone');
    let img = zone.querySelector('img.up');
    if(!img){img=document.createElement('img');img.className='up';zone.appendChild(img);}
    img.src = e.target.result;
    zone.querySelector('.uz-icon').style.display='none';
    zone.querySelector('.uz-txt').style.display='none';
  };
  reader.readAsDataURL(file);
}

function handleAdvertImg(input,idx){
  const file = input.files[0];
  if(!file)return;
  const reader = new FileReader();
  reader.onload = e=>{
    const card = input.closest('.advert-card');
    let img = card.querySelector('img.uploaded');
    if(!img){img=document.createElement('img');img.className='uploaded';card.insertBefore(img,card.querySelector('.advert-overlay'));}
    img.src=e.target.result;
    const slot = card.querySelector('.img-slot');
    slot.querySelector('.slot-icon').style.display='none';
    slot.querySelector('.slot-txt').style.display='none';
  };
  reader.readAsDataURL(file);
}

function handleGalleryImg(input,idx){
  const file = input.files[0];
  if(!file)return;
  const reader = new FileReader();
  reader.onload = e=>{
    const cell = input.closest('.g-cell');
    let img = cell.querySelector('img.g-img');
    if(!img){img=document.createElement('img');img.className='g-img';cell.insertBefore(img,cell.querySelector('.g-label'));}
    img.src=e.target.result;
    const up=cell.querySelector('.g-upload');
    up.querySelector('svg').style.display='none';
    up.querySelector('span').style.display='none';
    img.addEventListener('click',()=>{
      document.getElementById('lightbox-img').src=e.target.result;
      document.getElementById('lightbox').classList.add('open');
    });
  };
  reader.readAsDataURL(file);
}

// Lightbox close
document.getElementById('lightbox-close').addEventListener('click',()=>{
  document.getElementById('lightbox').classList.remove('open');
});
document.getElementById('lightbox').addEventListener('click',e=>{
  if(e.target===e.currentTarget)e.currentTarget.classList.remove('open');
});

/* ═════════════════════════════════
   RSVP FORM
═════════════════════════════════ */
function handleRsvp(e){
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),4500);
  e.target.reset();
}

/* ═════════════════════════════════
   PARALLAX on hero rings
═════════════════════════════════ */
window.addEventListener('scroll',()=>{
  const y = window.scrollY;
  const r1 = document.querySelector('.hero-ring');
  const r2 = document.querySelector('.hero-ring2');
  if(r1)r1.style.transform=`translate(-50%,calc(-50% + ${y*.08}px)) rotate(${y*.05}deg)`;
  if(r2)r2.style.transform=`translate(-50%,calc(-50% + ${y*.05}px)) rotate(${-y*.03}deg)`;
});
