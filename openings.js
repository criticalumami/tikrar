/* Beit Lantern · opening catalogue from "Houses of Beirut 1860–1925, Restoration manual" (Beirut Heritage Initiative, 2021).
   One printed module: 60 × 60 mm square, 40 mm walls, 3 mm thick, slanted roof. All sizes fired mm, 1:75
   (60 mm = a 4.5 m bay, 40 mm = a 3.0 m wall). Face coordinates: x from the wall's left edge seen from outside, y up from the floor. */
(function(G){
const W=60,H=40,PI=Math.PI;
/* for now everything is flush with the wall: no relief mouldings, balconies or sun-shades */
const FLUSH=true;
const LIM={edge:3,top:3,base:2,minOpen:1.6,minBar:2.5,maxOpen:40,reliefTop:1,maxPins:40,section:60,wall:3,minPin:1.4,canti:6,tealight:38};

/* ---------- outlines ---------- */
/* every outline remembers its kind and radius, for the technical sheet's annotations */
const tag=(p,kind,o)=>Object.assign(p,{kind},o||{});
const R=(x,y,w,h)=>tag([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],"rect");
function ARC(cx,cy,r,a0,a1,n){const o=[];for(let k=0;k<=n;k++){const a=a0+(a1-a0)*k/n;o.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return o;}
const ROUND=(x,s,w,h)=>{const r=w/2,st=Math.max(0.01,h-r);return tag([[x,s],[x+w,s],...ARC(x+r,s+st,r,0,PI,20)],"round arch",{r,cx:x+r,cy:s+st});};
const POINTED=(x,s,w,h)=>{const st=Math.max(0.01,h-0.866*w);return tag([[x,s],[x+w,s],...ARC(x,s+st,w,0,PI/3,10),...ARC(x+w,s+st,w,2*PI/3,PI,10).slice(1)],"pointed arch",{r:w,cx:x,cy:s+st});};
const SEGM=(x,s,w,h)=>{const r0=w/6,Rr=(w*w/4+r0*r0)/(2*r0),st=Math.max(0.01,h-r0),cy=s+st+r0-Rr,a=Math.asin((w/2)/Rr);return tag([[x,s],[x+w,s],...ARC(x+w/2,cy,Rr,PI/2-a,PI/2+a,16)],"segmental arch",{r:Rr,cx:x+w/2,cy});};
const ELL=(cx,cy,rx,ry)=>{const o=[];for(let k=0;k<32;k++){const a=2*PI*k/32;o.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);}return tag(o,Math.abs(rx-ry)<1e-6?"circle":"oval",{r:rx,ry,cx,cy});};
/* horseshoe ("keyhole") arch: the circle is wider than the shaft below it */
const HORSESHOE=(x,s,w,h)=>{const r=w*0.6,cx=x+w/2,cy=s+h-r,a0=Math.atan2(-Math.sqrt(r*r-w*w/4),w/2);return tag([[x,s],[x+w,s],...ARC(cx,cy,r,a0,PI-a0,24)],"horseshoe arch",{r,cx,cy});};
const ARCHES={pointed:POINTED,round:ROUND,horseshoe:HORSESHOE};
function bbox(p){let a=1e9,b=1e9,c=-1e9,d=-1e9;p.forEach(([x,y])=>{a=Math.min(a,x);b=Math.min(b,y);c=Math.max(c,x);d=Math.max(d,y);});return {x0:a,y0:b,x1:c,y1:d,w:c-a,h:d-b};}
function area(p){let s=0;for(let i=0;i<p.length;i++){const [x0,y0]=p[i],[x1,y1]=p[(i+1)%p.length];s+=x0*y1-x1*y0;}return Math.abs(s)/2;}

/* ---------- face collector ---------- */
const F=()=>({holes:[],relief:[],extras:[],fins:[]});
const hole=(o,p,set)=>o.holes.push({p,set:set||0});   /* set: which resin insert set carries the pin */
const frame=(o,fn,x,s,w,h,t)=>o.relief.push({o:fn(x-t,s-t,w+2*t,h+2*t),i:fn(x,s,w,h)});   /* encadrement: a raised band round an opening */
const band=(o,x,y,w,h)=>o.relief.push({o:R(x,y,w,h)});
const fin=(o,w,name)=>o.fins.push({w,name});                                             /* a column between openings, the full opening height */

/* ---------- catalogue (book page numbers) ---------- */
const CAT=[
 {id:"triple",group:"Bays",name:"Triple-arch bay",ref:"pp. 170–173",
  desc:"The emblem of the central-hall house: three arches on two slender columns, the centre one wider and taller. Pointed arches are the most common; semicircular ones are the exception.",
  styles:{label:"Arches",options:{pointed:"Pointed",round:"Semicircular"}},opts:["cornice","balcony"],cornice:"Discharging arch (relief)",
  build(o,q){const f=ARCHES[q.style]||POINTED,col=2.6,sw=10,cw=14,s=4,x0=(W-(2*sw+cw+2*col))/2;
   hole(o,f(x0,s,sw,22));hole(o,f(x0+sw+col,s,cw,28));hole(o,f(x0+sw+col+cw+col,s,sw,22));fin(o,col,"Triple-arch columns");
   if(q.cornice)o.relief.push({o:SEGM(x0-2.4,s,W-2*x0+4.8,32.6),i:SEGM(x0-1.2,s,W-2*x0+2.4,31.4)});
   if(q.balcony)o.extras.push({t:"balcony",x:x0-3,w:W-2*x0+6,y:s});}},
 {id:"liwan",group:"Bays",name:"Līwān arch",ref:"pp. 20–22",
  desc:"One large arch opening the hall or porch to the outside. The early central-hall houses had a single large arch before the triple arch became the norm.",
  styles:{label:"Arch",options:{round:"Semicircular",pointed:"Pointed",horseshoe:"Horseshoe"}},opts:["frame","balcony","oculus"],
  build(o,q){const f=ARCHES[q.style]||ROUND,hw=q.style==="horseshoe"?20:24,x=(W-hw)/2,hh=q.style==="pointed"?31:29;hole(o,f(x,3,hw,hh));if(q.frame)frame(o,f,x,3,hw,hh,1.4);
   if(q.balcony)o.extras.push({t:"balcony",x:15,w:30,y:3});}},
 {id:"closedLiwan",group:"Bays",name:"Door between two windows",ref:"p. 20",
  desc:"The closed līwān: a centred door flanked by two windows, the standard front of the smaller extra-mural houses.",
  opts:["frame","cornice","oculus"],cornice:"Cornices over the windows",
  build(o,q){hole(o,SEGM(24.5,2,11,24));hole(o,R(9,12,7,13));hole(o,R(44,12,7,13));
   if(q.frame){frame(o,SEGM,24.5,2,11,24,1.2);frame(o,R,9,12,7,13,1.2);frame(o,R,44,12,7,13,1.2);}
   if(q.cornice){band(o,7.4,26.6,10.2,1.6);band(o,42.4,26.6,10.2,1.6);}}},
 {id:"orientalDoor",group:"Doors",name:"Oriental door, hilālī arch",ref:"p. 162",
  desc:"Pre-1860 door in the stone, closed by an interior leaf. A segmental arch (hilālī), on average 95 cm wide and 190 cm high, framed by carefully cut stones.",
  opts:["frame","oculus"],frameName:"Cut-stone frame (relief)",
  build(o,q){hole(o,SEGM(23.6,2,12.8,25.3));if(q.frame)frame(o,SEGM,23.6,2,12.8,25.3,1.8);}},
 {id:"westernDoor",group:"Doors",name:"Entrance door with fanlight",ref:"pp. 163–164",
  desc:"Post-1860 rectangular door (100–110 × 200–220 cm), framed by two pilasters and a lintel, often topped by an openwork or blind arched tympanum.",
  styles:{label:"Tympanum",options:{round:"Open, semicircular",pointed:"Open, pointed",blind:"Blind (relief)"}},opts:["frame"],frameName:"Pilasters and lintel (relief)",
  build(o,q){const st=q.style||"round",dh=st==="pointed"?20:23;hole(o,R(23,2,14,dh));
   if(st==="blind")o.relief.push({o:ROUND(23,dh+4.6,14,7.5)});else hole(o,(ARCHES[st])(23,dh+4.6,14,st==="pointed"?12.2:7.5));
   if(q.frame){band(o,19.8,2,1.8,dh+2.6);band(o,38.4,2,1.8,dh+2.6);band(o,19.8,dh+2.6,20.4,1.4);}}},
 {id:"shop",group:"Doors",name:"Shop front, discharging arch",ref:"p. 165",
  desc:"Ground-floor store front closed by two to four doors, under a discharging arch that follows the vault behind it.",
  opts:["frame"],frameName:"Discharging arch (relief)",
  build(o,q){hole(o,SEGM(15,2,30,22));if(q.frame)frame(o,SEGM,15,2,30,22,2);}},
 {id:"tallWindow",group:"Windows",name:"Tall window with cornice",ref:"pp. 166–168",
  desc:"The common window: a fixed frame on a parapet about 75 cm high, crowned by a projecting cornice that throws off the rain.",
  opts:["frame","cornice","balcony","oculus"],cornice:"Projecting cornice (relief)",
  build(o,q){hole(o,R(24,10,12,20));if(q.frame)frame(o,R,24,10,12,20,1.2);if(q.cornice)band(o,21.5,31.4,17,1.8);
   if(q.balcony)o.extras.push({t:"balcony",x:20,w:20,y:10});}},
 {id:"pair",group:"Windows",name:"Pair of tall windows",ref:"p. 166",
  desc:"Two tall windows on one sill line: the side rooms that flank the central hall.",
  opts:["frame","cornice","oculus"],cornice:"Cornices (relief)",
  build(o,q){[13,38].forEach(x=>{hole(o,R(x,10,9,19));if(q.frame)frame(o,R,x,10,9,19,1.2);if(q.cornice)band(o,x-2,30.4,13,1.6);});}},
 {id:"arched",group:"Windows",name:"Arched window",ref:"p. 169",
  desc:"Rectangular below, pointed or semicircular above. Usually lights a corridor or stairwell; the arch was also what made larger openings possible.",
  styles:{label:"Arch",options:{round:"Semicircular",pointed:"Pointed",horseshoe:"Horseshoe"}},opts:["frame","oculus"],
  build(o,q){const f=ARCHES[q.style]||ROUND;hole(o,f(24,9,12,24));if(q.frame)frame(o,f,24,9,12,24,1.2);}},
 {id:"coupled",group:"Windows",name:"Coupled windows",ref:"p. 169",
  desc:"Two twin arched openings with an intermediate column, often lighting a stairwell, one arch per flight.",
  styles:{label:"Arches",options:{pointed:"Pointed",round:"Semicircular"}},opts:["cornice","oculus"],cornice:"Hood moulding (relief)",
  build(o,q){const f=ARCHES[q.style]||POINTED;hole(o,f(19.7,9,9,22));hole(o,f(31.3,9,9,22));fin(o,2.6,"Coupled-window column");
   if(q.cornice)o.relief.push({o:SEGM(17.5,9,25,24.8),i:SEGM(18.7,9,22.6,23.6)});}},
 {id:"high",group:"Windows",name:"High windows",ref:"p. 169",
  desc:"Small (about 40 cm wide) rectangular or pointed windows set high, typical of first-generation houses, kitchens and attics, before the oculus.",
  styles:{label:"Shape",options:{rect:"Rectangular",pointed:"Pointed"}},opts:["frame"],
  build(o,q){[14.3,40.3].forEach(x=>{const f=q.style==="pointed"?POINTED:R;hole(o,f(x,24,5.4,10));if(q.frame)frame(o,f,x,24,5.4,10,1);});}},
 {id:"oculus",group:"Windows",name:"Oculus (qamariyeh)",ref:"p. 169",
  desc:"A fixed round or oval bull's-eye, set high in an ordered pattern. The one on the līwān axis is often oval.",
  styles:{label:"Shape",options:{round:"Round",oval:"Oval"}},opts:["frame"],
  build(o,q){const p=q.style==="oval"?ELL(30,24,8,5.5):ELL(30,24,6,6);hole(o,p);
   if(q.frame)o.relief.push({o:q.style==="oval"?ELL(30,24,9.4,6.9):ELL(30,24,7.4,7.4),i:p});}},
 {id:"blank",group:"Other",name:"Blind wall",ref:"",
  desc:"No opening. Useful on the sides and back, or for a wall that only carries an oculus.",
  opts:["oculus","cornice"],cornice:"String course (relief)",
  build(o,q){if(q.cornice)band(o,3,30,54,1.2);}}
];
/* ---------- modernist walls (Architectures de Beyrouth 1925–1970: typologies PDF pp. 16–20, cantilevers p. 38,
   brise-soleil and claustras pp. 52–53, windows pp. 78–93) ---------- */
const AB="Architectures de Beyrouth";
function grid(o,cols,rows,px,py,cy0,shape){const x0=W/2-(cols-1)*px/2;let n=0;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){hole(o,shape(x0+i*px,cy0+j*py),1+Math.floor(n/LIM.maxPins));n++;}}
/* 6 mm pitch, 3.4 mm cells: 2.6 mm porcelain between them */
const SHAPES={squares:(x,y)=>R(x-1.7,y-1.7,3.4,3.4),circles:(x,y)=>ELL(x,y,1.7,1.7),
  crosses:(x,y)=>[[x-0.85,y-1.7],[x+0.85,y-1.7],[x+0.85,y-0.85],[x+1.7,y-0.85],[x+1.7,y+0.85],[x+0.85,y+0.85],[x+0.85,y+1.7],[x-0.85,y+1.7],[x-0.85,y+0.85],[x-1.7,y+0.85],[x-1.7,y-0.85],[x-0.85,y-0.85]],
  lozenges:(x,y)=>[[x,y-1.7],[x+1.7,y],[x,y+1.7],[x-1.7,y]]};
CAT.forEach(c=>c.set=c.set||"ottoman");
CAT.push(
 {set:"modern",id:"ribbon",group:"Modernist",name:"Ribbon window",ref:AB+", windows pp. 78–93",
  desc:"A long horizontal window from one structural line to the next, the signature of the 1950s–60s facade, often under a thin cantilevered sun-shade slab.",
  styles:{label:"Ribbons",options:{one:"One ribbon",two:"Two ribbons"}},opts:["canopy"],
  build(o,q){if(q.style==="two"){hole(o,R(6,8,48,6));hole(o,R(6,24,48,6));}else hole(o,R(6,17,48,8));
   if(q.canopy)o.extras.push({t:"canopy",x:4,w:52,y:q.style==="two"?32.2:27.2});}},
 {set:"modern",id:"claustra",group:"Modernist",name:"Claustra screen",ref:AB+", pp. 52–53",
  desc:"A screen of cast blocks pierced in a repeating pattern: shade and air in, privacy kept. At night the whole wall glitters.",
  styles:{label:"Pattern",options:{squares:"Squares",circles:"Circles",crosses:"Crosses",lozenges:"Lozenges"}},opts:["frame"],frameName:"Frame (relief)",
  build(o,q){grid(o,8,5,6,6,9,SHAPES[q.style]||SHAPES.squares);if(q.frame)o.relief.push({o:R(5.5,4.4,49,33.2),i:R(7,5.9,46,30.2)});}},
 {set:"modern",id:"fins",group:"Modernist",name:"Vertical fins (brise-soleil)",ref:AB+", pp. 52–53",
  desc:"Tall slots between deep vertical fins that cut the low east and west sun: the sun-breaker wall.",
  opts:["frame"],frameName:"Raised fins (relief)",
  build(o,q){for(let i=0;i<7;i++){const x=11.4+i*6.2;hole(o,R(x,5,2.6,30));if(q.frame&&i<6)band(o,x+3.2,4,1.2,32);}fin(o,3.6,"Brise-soleil fins");}},
 {set:"modern",id:"eggcrate",group:"Modernist",name:"Egg-crate grid",ref:AB+", pp. 52–53",
  desc:"A deep grid of horizontal and vertical sun-breakers, each cell recessed with a small window at the back.",
  build(o,q){for(let j=0;j<3;j++)for(let i=0;i<5;i++){const x=12+i*9,y=8+j*10.5;o.relief.push({o:R(x-4.1,y-1.9,8.2,9.8),i:R(x-2.5,y,5,6)});hole(o,R(x-2.5,y,5,6));}}},
 {set:"modern",id:"pilotis",group:"Modernist",name:"Pilotis, open ground floor",ref:AB+", typologies pp. 16–20",
  desc:"The building lifted on columns over an open, lit ground floor, with a solid upper wall and a ribbon above.",
  opts:["canopy"],
  build(o,q){[5,22.5,40].forEach(x=>hole(o,R(x,2,15,14)));fin(o,2.5,"Pilotis");band(o,3,18,54,1.4);hole(o,R(12,25,36,6));
   if(q.canopy)o.extras.push({t:"canopy",x:4,w:52,y:16.4});}},
 {set:"modern",id:"portholes",group:"Modernist",name:"Portholes",ref:AB+", windows pp. 78–93",
  desc:"Round windows in a row or up a stair tower, the nautical touch of the 1930s–50s.",
  styles:{label:"Layout",options:{row:"In a row",tower:"Up a stair tower"}},opts:["frame"],
  build(o,q){const pts=q.style==="tower"?[[30,8],[30,20],[30,32]]:[[15,22],[30,22],[45,22]];const r=q.style==="tower"?4:4.5;
   pts.forEach(([x,y])=>{hole(o,ELL(x,y,r,r));if(q.frame)o.relief.push({o:ELL(x,y,r+1.2,r+1.2),i:ELL(x,y,r,r)});});}},
 {set:"modern",id:"picture",group:"Modernist",name:"Wide picture window",ref:AB+", windows pp. 78–93",
  desc:"One large rectangular window: by the 1920s–30s the triple arch was replaced by large rectangular windows.",
  opts:["frame","canopy"],
  build(o,q){hole(o,R(10,8,40,22));if(q.frame)frame(o,R,10,8,40,22,1.2);if(q.canopy)o.extras.push({t:"canopy",x:6,w:48,y:32.4});}},
 {set:"modern",id:"glassblock",group:"Modernist",name:"Glass-block stair light",ref:AB+", pp. 52–53",
  desc:"A tall strip of small square lights, as the cast glass blocks that lit modernist stairwells.",
  build(o,q){for(let j=0;j<5;j++)for(let i=0;i<3;i++)hole(o,R(23+i*5.6,6+j*6,3,3));}}
);
/* ---------- Swiss grid (after Josef Müller-Brockmann): the 60 × 40 wall as a field of 6 × 4 cells ----------
   4 mm side margins (clear of a 4 mm corner radius), 3 mm top and bottom, 2.8 mm gutters (over the 2.5 mm bar limit).
   An opening is a run of whole cells, so openings line up from wall to wall, module to module and level to level. */
const GM={x:4,y:3,g:2.8,cols:6,rows:4},GCW=(W-2*GM.x-(GM.cols-1)*GM.g)/GM.cols,GRH=(H-2*GM.y-(GM.rows-1)*GM.g)/GM.rows;
/* cells c0..c0+cw-1 across, r0..r0+rh-1 up (row 0 at the bottom) */
const CELL=(c0,r0,cw,rh)=>tag(R(GM.x+c0*(GCW+GM.g),GM.y+r0*(GRH+GM.g),cw*GCW+(cw-1)*GM.g,rh*GRH+(rh-1)*GM.g),"grid cell",{cells:[c0,r0,cw,rh]});
const cells=(o,list)=>list.forEach(a=>hole(o,CELL(...a)));
const GR="Swiss grid, after J. Müller-Brockmann";
CAT.push(
 {set:"grid",id:"gField",name:"Field",ref:GR,desc:"One block of 3 × 2 cells set off-centre, low on the wall: the asymmetric balance of a grid poster.",
  build(o){cells(o,[[0,1,3,2]]);}},
 {set:"grid",id:"gColumn",name:"Column and point",ref:GR,desc:"A full-height column of light on the fifth line, answered by a single cell at the opposite corner.",
  build(o){cells(o,[[4,0,1,4],[1,3,1,1]]);}},
 {set:"grid",id:"gBand",name:"Band",ref:GR,desc:"A ribbon five cells long on the second row, and one cell set apart above it.",
  build(o){cells(o,[[0,1,5,1],[5,3,1,1]]);}},
 {set:"grid",id:"gStep",name:"Steps",ref:GR,desc:"Four cells climbing the diagonal of the grid, one per row.",
  build(o){cells(o,[[0,0,1,1],[1,1,1,1],[2,2,1,1],[3,3,1,1]]);}},
 {set:"grid",id:"gRhythm",name:"Rhythm",ref:GR,desc:"Every cell of one row open: a regular beat across the wall that carries on into the next module.",
  build(o){cells(o,[[0,2,1,1],[1,2,1,1],[2,2,1,1],[3,2,1,1],[4,2,1,1],[5,2,1,1]]);}},
 {set:"grid",id:"gChecker",name:"Checker",ref:GR,desc:"Alternate cells, row by row: the most even light the grid allows.",
  build(o){for(let r=0;r<4;r++)for(let c=r%2;c<6;c+=2)hole(o,CELL(c,r,1,1));}},
 {set:"grid",id:"gCounter",name:"Counterpoint",ref:GR,desc:"A wide field of 4 × 2 cells on the ground, a single cell high at the far edge.",
  build(o){cells(o,[[0,0,4,2],[5,3,1,1]]);}},
 {set:"grid",id:"gLadder",name:"Ladder",ref:GR,desc:"One column of four separate cells, and a two-cell slot on the far side.",
  build(o){cells(o,[[1,0,1,1],[1,1,1,1],[1,2,1,1],[1,3,1,1],[4,2,1,2]]);}},
 {set:"grid",id:"gDoor",name:"Door and lights",ref:GR,desc:"A two-cell-wide door three rows high, with a row of three lights at the top.",
  build(o){cells(o,[[1,0,2,3],[3,3,1,1],[4,3,1,1],[5,3,1,1]]);}}
);
const BY=Object.fromEntries(CAT.map(c=>[c.id,c]));

/* ---------- typical elements, composed three to a wall (bay centres at 12, 30 and 48 mm) ---------- */
const BAY_X=[12,30,48];
const BAYS=[
 {id:"pointed",name:"Tall pointed arch",ref:"pp. 169–172",build:(o,c)=>hole(o,POINTED(c-5,6,10,28))},
 {id:"round",name:"Tall round arch",ref:"p. 169",build:(o,c)=>hole(o,ROUND(c-5,6,10,28))},
 {id:"horseshoe",name:"Horseshoe arch",ref:"p. 172",build:(o,c)=>hole(o,HORSESHOE(c-4.5,6,9,28))},
 {id:"door",name:"Door with oculus",ref:"pp. 163, 169",build:(o,c)=>{hole(o,R(c-4,4,8,20));hole(o,ELL(c,30.5,4,4));}},
 {id:"window",name:"Tall window",ref:"p. 166",build:(o,c)=>hole(o,R(c-4.5,10,9,20))},
 {id:"small",name:"Small arched window",ref:"p. 169",build:(o,c)=>hole(o,ROUND(c-2.5,14,5,10))},
 {id:"high",name:"High pointed window",ref:"p. 169",build:(o,c)=>hole(o,POINTED(c-2.7,24,5.4,10))},
 {id:"oculus",name:"Oculus",ref:"p. 169",build:(o,c)=>hole(o,ELL(c,26,4.5,4.5))},
 {id:"none",name:"Solid",ref:"",build:()=>{}},
 {set:"modern",id:"slot",name:"Tall slot",ref:AB+" pp. 78–93",build:(o,c)=>hole(o,R(c-3,6,6,26))},
 {set:"modern",id:"twinSlots",name:"Twin slits",ref:AB+" pp. 52–53",build:(o,c)=>{hole(o,R(c-4,6,2.6,26));hole(o,R(c+1.4,6,2.6,26));}},
 {set:"modern",id:"square",name:"Square window",ref:AB+" pp. 78–93",build:(o,c)=>hole(o,R(c-5,14,10,10))},
 {set:"modern",id:"ribbonSeg",name:"Ribbon segment",ref:AB+" pp. 78–93",build:(o,c)=>hole(o,R(c-7.5,18,15,7))},
 {set:"modern",id:"porthole",name:"Porthole",ref:AB+" pp. 78–93",build:(o,c)=>hole(o,ELL(c,22,5,5))},
 {set:"modern",id:"portholes3",name:"Porthole column",ref:AB+" pp. 78–93",build:(o,c)=>[9,20,31].forEach(y=>hole(o,ELL(c,y,3,3)))},
 {set:"modern",id:"claustraCol",name:"Claustra column",ref:AB+" pp. 52–53",build:(o,c,i)=>{for(let j=0;j<5;j++)for(let k=0;k<3;k++)hole(o,R(c-6.1+k*4.9,8+j*4.9,2.4,2.4),1+i);}}
 ,{set:"grid",id:"gTall",name:"Low pair",ref:GR,build:(o,c,i)=>hole(o,CELL(2*i,0,2,2))}
 ,{set:"grid",id:"gSlot",name:"Slot",ref:GR,build:(o,c,i)=>hole(o,CELL(2*i,0,1,4))}
 ,{set:"grid",id:"gSquare",name:"High square",ref:GR,build:(o,c,i)=>hole(o,CELL(2*i,2,2,2))}
 ,{set:"grid",id:"gTwo",name:"Two cells",ref:GR,build:(o,c,i)=>{hole(o,CELL(2*i,1,1,1));hole(o,CELL(2*i+1,1,1,1));}}
 ,{set:"grid",id:"gStack",name:"Stacked cells",ref:GR,build:(o,c,i)=>{hole(o,CELL(2*i+1,0,1,1));hole(o,CELL(2*i+1,2,1,1));}}
 ,{set:"grid",id:"gTop",name:"Top light",ref:GR,build:(o,c,i)=>hole(o,CELL(2*i,3,2,1))}
];
BAYS.forEach(b=>b.set=b.set||(b.id==="none"?"both":"ottoman"));
const BAY=Object.fromEntries(BAYS.map(b=>[b.id,b]));
const OPT_LABEL={frame:"Frame (relief)",cornice:"Cornice (relief)",balcony:"Porcelain balcony",oculus:"Oculus above",canopy:"Sun-shade slab (6 mm)"};
const optsOf=c=>(c.opts||[]).filter(k=>!FLUSH||k==="oculus");
const stylesOf=c=>{if(!c.styles)return null;const o=Object.assign({},c.styles.options);if(FLUSH&&c.id==="westernDoor")delete o.blind;return {label:c.styles.label,options:o};};
const optLabel=(c,k)=>k==="frame"?(c.frameName||OPT_LABEL.frame):k==="cornice"?(c.cornice||OPT_LABEL.cornice):OPT_LABEL[k];

/* oculus above: only where the main opening leaves room under the scrape edge */
const OCULUS=()=>ELL(30,32.2,3,3);
function gap(a,b){const A=bbox(a),B=bbox(b),dx=Math.max(B.x0-A.x1,A.x0-B.x1,0),dy=Math.max(B.y0-A.y1,A.y0-B.y1,0);return Math.hypot(dx,dy);}
function oculusFits(o){return o.holes.every(h=>gap(h.p,OCULUS())>=LIM.minBar);}

function build(spec){
  if(spec.mode==="bays"){const o=F();(spec.bays||[]).forEach((b,i)=>(BAY[b]||BAY.none).build(o,BAY_X[i],i));if(FLUSH){o.relief=[];o.extras=[];}return o;}
  const c=BY[spec.type]||BY.blank,o=F(),q=Object.assign({style:c.styles?Object.keys(c.styles.options)[0]:""},spec);
  c.build(o,q);
  if(q.oculus&&(c.opts||[]).includes("oculus")&&oculusFits(o))hole(o,OCULUS());
  if(FLUSH){o.relief=[];o.extras=[];}
  return o;}
function canOculus(spec){if(spec.mode==="bays")return false;const o=F(),c=BY[spec.type]||BY.blank;c.build(o,Object.assign({},spec,{oculus:false}));return (c.opts||[]).includes("oculus")&&oculusFits(o);}

/* ---------- checks for one face ---------- */
function checkFace(o,shrink,radius){const edge=Math.max(LIM.edge,radius||0);   /* openings stay off the rounded corner as well as the mitre */
  const k=1/(1-(shrink||14)/100),hs=o.holes.map(h=>({p:h.p,b:bbox(h.p)}));
  const minOpen=hs.length?Math.min(...hs.map(h=>Math.min(h.b.w,h.b.h))):null;
  let minGap=1e9;for(let i=0;i<hs.length;i++)for(let j=i+1;j<hs.length;j++)minGap=Math.min(minGap,gap(hs[i].p,hs[j].p));
  const finMin=o.fins.length?Math.min(...o.fins.map(f=>f.w)):null;
  const open=hs.reduce((a,h)=>a+area(h.p),0)/(W*H)*100;
  const out=[];const add=(ok,label,v)=>out.push({ok,label,v});
  add(minOpen===null||minOpen>=LIM.minOpen-1e-6,"Openings ≥ "+LIM.minOpen+" mm",minOpen===null?"none":minOpen.toFixed(1)+" mm");
  add(minOpen===null||minOpen*k-0.3>=LIM.minPin-1e-6,"Resin pins ≥ "+LIM.minPin+" mm master",minOpen===null?"–":(minOpen*k-0.3).toFixed(2)+" mm");
  add(open<=LIM.maxOpen+1e-6,"Wall ≤ "+LIM.maxOpen+" % open",open.toFixed(0)+" %");
  add(hs.every(h=>h.b.x0>=edge-1e-6&&h.b.x1<=W-edge+1e-6),"≥ "+edge+" mm from the corners",hs.length?Math.min(...hs.map(h=>Math.min(h.b.x0,W-h.b.x1))).toFixed(1)+" mm":"–");
  add(hs.every(h=>h.b.y1<=H-LIM.top+1e-6),"Clear of the scrape edge ("+LIM.top+" mm)",hs.length?(H-Math.max(...hs.map(h=>h.b.y1))).toFixed(1)+" mm":"–");
  add(hs.every(h=>h.b.y0>=LIM.base-1e-6),"≥ "+LIM.base+" mm above the base lip",hs.length?Math.min(...hs.map(h=>h.b.y0)).toFixed(1)+" mm":"–");
  add(minGap>=LIM.minBar-1e-6&&(finMin===null||finMin>=LIM.minBar-1e-6),"Bars and columns ≥ "+LIM.minBar+" mm",(Math.min(minGap,finMin===null?1e9:finMin)<1e8?Math.min(minGap,finMin===null?1e9:finMin).toFixed(1)+" mm":"–"));
  add(o.relief.every(r=>bbox(r.o).y1<=H-LIM.reliefTop+1e-6),"Relief ≥ "+LIM.reliefTop+" mm below the top","0.8 mm deep");
  const sets={};o.holes.forEach(h=>sets[h.set||0]=(sets[h.set||0]||0)+1);const maxSet=Math.max(0,...Object.values(sets));
  add(maxSet<=LIM.maxPins,"Pins per insert set ≤ "+LIM.maxPins,hs.length+" pins"+(Object.keys(sets).length>1?" in "+Object.keys(sets).length+" sets":""));
  return {list:out,open,pins:hs.length,ok:out.every(c=>c.ok)};}

/* ---------- 2D elevation ---------- */
function faceSVG(o,opt){opt=opt||{};const night=!!opt.night;
  const wall=night?"#5a4a3d":"#f4efe6",edge=night?"#3b3129":"#b9ae9c",glow=night?"#ffbf66":"#2c2a28",rel=night?"#7a6654":"#e3dacb";
  const pts=p=>p.map(([x,y])=>x.toFixed(2)+","+(H-y).toFixed(2)).join(" ");
  let s=`<svg viewBox="${opt.dims?"-7 -4 74 54":"-1 -1 62 42"}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${opt.label||"Wall elevation"}">`;
  s+=`<rect x="0" y="0" width="${W}" height="${H}" fill="${wall}" stroke="${edge}" stroke-width=".4"/>`;
  o.relief.forEach(r=>{s+=`<polygon points="${pts(r.o)}" fill="${rel}" stroke="${edge}" stroke-width=".25"/>`;if(r.i)s+=`<polygon points="${pts(r.i)}" fill="${wall}"/>`;});
  o.holes.forEach(h=>s+=`<polygon points="${pts(h.p)}" fill="${glow}"/>`);
  o.extras.forEach(x=>{if(x.t==="canopy")s+=`<rect x="${x.x}" y="${H-x.y-2}" width="${x.w}" height="2" fill="${edge}"/>`;if(x.t==="balcony"){const y=H-x.y;s+=`<rect x="${x.x}" y="${y}" width="${x.w}" height="2.2" fill="${edge}"/>`;
    for(let bx=x.x+1.2;bx<x.x+x.w-1.5;bx+=4.3)s+=`<rect x="${bx.toFixed(2)}" y="${(y-8).toFixed(2)}" width="2.5" height="8" fill="${edge}" opacity=".85"/>`;
    s+=`<rect x="${x.x}" y="${y-9}" width="${x.w}" height="1.4" fill="${edge}"/>`;}});
  if(opt.dims){const t=(x,y,str,a)=>`<text x="${x}" y="${y}" font-size="2.6" fill="${night?"#c9bfae":"#6d665c"}" text-anchor="${a||"middle"}" font-family="JetBrains Mono,monospace">${str}</text>`;
    s+=`<line x1="0" y1="${H+2.2}" x2="${W}" y2="${H+2.2}" stroke="${edge}" stroke-width=".3"/>`+t(30,H+5.6,"60 mm");
    s+=`<line x1="-2.2" y1="0" x2="-2.2" y2="${H}" stroke="${edge}" stroke-width=".3"/>`+`<text x="-3.6" y="20" font-size="2.6" fill="${night?"#c9bfae":"#6d665c"}" text-anchor="middle" font-family="JetBrains Mono,monospace" transform="rotate(-90 -3.6 20)">40 mm</text>`;}
  return s+"</svg>";}

G.BeitOpenings={W,H,LIM,FLUSH,CAT,BY,BAYS,BAY,optsOf,stylesOf,build,canOculus,checkFace,faceSVG,bbox,area,optLabel};
})(window);
