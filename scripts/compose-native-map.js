// Executed in the Azgaar 1.158 editor after its initial map has loaded.
// The editor itself computes the Voronoi graph and serializes the finished map.
async function composeNativeMap(atlas) {
  const api = window.FMG;
  const options = api.options.map;
  const original = api.pack;
  const neutral = structuredClone(original.states[0]);
  const culture = structuredClone(original.cultures[0]);
  const religion = structuredClone(original.religions[0]);
  const seed = "14162026094";
  Object.assign(options.graph, {width: atlas.width, height: atlas.height, points: 20000});
  options.seed = seed;
  options.lore.name = "放开那个女巫 · 四大王国与灰堡西境";
  options.lore.description = "依据小说前期地名与相对方位重绘。国界、海岸、距离及高程为制图推定。历法、人口、经济与道路数值用于编辑器模拟。";
  Object.assign(options.lore.calendar,{year:1,era:"争王令时期（示意）",eraShort:"争王"});
  for (const g of options.labels.groups) if (["capital","city","town","fort","river"].includes(g.name)) {
    g.zoom.min = null;
    g.zoom.max = null;
  }
  const inside = ([x, y], ring) => {
    let contained = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [a, b] = ring[i], [c, d] = ring[j];
      if ((b > y) !== (d > y) && x < (c - a) * (y - b) / (d - b) + a) contained = !contained;
    }
    return contained;
  };
  function distanceToLine(x, y, points) {
    let min = Infinity;
    for (let i = 1; i < points.length; i++) {
      const [ax, ay] = points[i-1], [bx, by] = points[i];
      const dx = bx-ax, dy = by-ay;
      const t = Math.max(0, Math.min(1, ((x-ax)*dx + (y-ay)*dy) / (dx*dx + dy*dy || 1)));
      min = Math.min(min, (x-ax-t*dx)**2 + (y-ay-t*dy)**2);
    }
    return Math.sqrt(min);
  }
  const graph = api.Grid.generate(seed, options.graph);
  api.Grid.prepare(graph);
  graph.points.forEach(([x,y], i) => {
    const ring = atlas.land.find(r => inside([x,y], r));
    if (!ring) { graph.cells.h[i] = 8; return; }
    const seaDistance = distanceToLine(x,y,ring);
    const rolling = 4*Math.sin(x/28) + 2*Math.cos(y/27) + 2*Math.sin((x+y)/15);
    const hills = Math.max(0,...atlas.mountains.map(m => {
      const d = distanceToLine(x,y,m.points);
      return Math.max(0,1 - d/23) ** 1.35 * (53 + 7*Math.cos(x/8));
    }));
    graph.cells.h[i] = Math.round(23 + Math.min(seaDistance/5,12) + Math.max(-2,rolling) + hills);
  });
  api.Features.markupGrid();
  Object.assign(options.geography,{mapSize:28,latitude:15,longitude:50});
  api.Coordinates.calculate();
  api.Temperature.generate();
  api.Precipitation.generate();
  api.Pack.clear();
  api.GraphOverride.clear();
  api.Pack.generate();
  api.Features.markupPack();
  const pack = api.pack, cells = pack.cells, count = cells.i.length;
  for (const field of ["r","fl","conf","state","burg","province","religion","market","culture"])
    cells[field] = new Uint16Array(count);
  Object.assign(pack, {rivers:[], addedLabels:[], markers:[], relief:[], burgs:[0],
    states:[neutral], cultures:[culture], religions:[religion], provinces:[0], routes:[],
    zones:[], markets:[], deals:[], journeys:[], legends:[], measurers:[], ice:[]});
  cells.routes = {};
  neutral.name = "未划定地区";
  neutral.diplomacy = [];
  neutral.military = [];
  neutral.provinces = [];
  neutral.campaigns = [];
  culture.name = "未划分";
  religion.name = "未划分";
  const noteFor = item => [item.desc,item.ref].filter(Boolean).join("　");
  function hydroMarker(point, name, type, glyph, note) {
    const [x,y] = point;
    pack.markers.push({i:pack.markers.length,x,y,cell:api.Pack.requireCell(x,y),
      type,icon:api.Icons.glyph(glyph),name,note,tags:[type]});
  }
  const groups = api.styles.rivers.groups;
  groups["人工运河"] = structuredClone(groups.regular);
  Object.assign(groups["人工运河"].attrs,{fill:"#0c796c",stroke:"#0b554d","stroke-width":0.45});
  Object.assign(api.styles.journeys.attrs,{"stroke-width":1.6,"stroke-dasharray":"3 4",opacity:.88});
  api.styles.journeys.options.arrows = false;
  const byId = new Map();
  const basinRoots = new Map();
  const surface = atlas.rivers.filter(item => !["underground","inferred"].includes(item.kind));
  const basinNames = new Map();
  for (const item of surface) {
    if (item.basinKey && !item.parentId && !basinNames.has(item.basinKey) && item.kind!=="canal")
      basinNames.set(item.basinKey,item.basinKey==="dawn" ? "晨曦河网" : item.name+"水系");
  }
  for (const item of atlas.rivers.filter(item => item.kind === "underground")) {
    const point = item.points[Math.floor(item.points.length/2)];
    const note = noteFor(item);
    hydroMarker(point,item.name,"地下水系","◇",note);
    const [lx,ly] = item.label || [point[0],point[1]-9];
    const label = api.AddedLabels.place(lx,ly,item.name);
    api.AddedLabels.get(label).note = note;
  }
  for (const item of atlas.waterNotes || atlas.hydroNotes || []) {
    const point = [item.x,item.y];
    const uncertain = item.symbol === "uncertain";
    hydroMarker(point,item.name,uncertain ? "已考河段边界" : "水文注记",uncertain ? "?" : "≈",noteFor(item));
    if (item.subLabel && item.label) api.AddedLabels.place(...item.label,item.subLabel);
  }
  for (const item of atlas.rivers.filter(item=>item.kind==="inferred")) {
    // A documented voyage with an unknown channel belongs to Journeys, outside the river network.
    const points=[];
    for(let segment=1;segment<item.points.length;segment++) {
      const [a,b]=item.points[segment-1], [c,d]=item.points[segment];
      const steps=Math.max(1,Math.ceil(Math.hypot(c-a,d-b)/.8));
      for(let j=0;j<=steps;j++) {
        const x=a+(c-a)*j/steps, y=b+(d-b)*j/steps;
        const cell=api.Pack.requireCell(x,y), previous=points.at(-1);
        if(previous?.[2]===cell) {
          if(j===steps) points[points.length-1]=[x,y,cell];
          continue;
        }
        if(previous && !cells.c[previous[2]].includes(cell)) {
          const bridge=cells.c[previous[2]].find(n=>cells.c[n].includes(cell));
          if(bridge!==undefined) points.push([...cells.p[bridge],bridge]);
        }
        points.push([x,y,cell]);
      }
    }
    const journey=api.Journeys.addEmpty();
    Object.assign(journey,{name:item.name,type:"航线示意",color:"#637f91",note:noteFor(item)});
    journey.segments=[{i:0,name:item.name,from:points[0][2],to:points.at(-1)[2],
      transport:"Sailing boat",speed:6,distance:api.Rivers.getApproximateLength(points),
      points,custom:true,note:noteFor(item)}];
    if (item.label) api.AddedLabels.place(item.label[0],item.label[1],item.name);
  }
  for (const item of surface) {
    const id = pack.rivers.length + 1;
    const course = [], anchors = [];
    for (let segment=1; segment<item.points.length; segment++) {
      const [a,b] = item.points[segment-1], [c,d] = item.points[segment];
      const steps = Math.max(1,Math.ceil(Math.hypot(c-a,d-b)/2));
      for (let n=0; n<=steps; n++) {
        const p=[a+(c-a)*n/steps,b+(d-b)*n/steps];
        const index=api.Pack.findCell(...p);
        if (!course.length && cells.h[index]<20) continue;
        if (index === course.at(-1)) continue;
        const seen=course.indexOf(index);
        if (seen>=0) {course.splice(seen+1); anchors.splice(seen+1); continue;}
        if (course.length && cells.h[course.at(-1)]<20) break;
        course.push(index); anchors.push(p);
      }
      if (course.length && cells.h[course.at(-1)]<20) break;
    }
    if (course.length<2) throw new Error("水道没有足够的可编辑格点："+item.name);
    for (const point of item.points) {
      const position=course.indexOf(api.Pack.findCell(...point));
      if(position>=0) anchors[position]=point;
    }
    const last=course.at(-1);
    course.forEach((cell,i) => {
      if (cells.h[cell]>=20 && !cells.r[cell]) cells.r[cell]=id;
      cells.fl[cell]=Math.max(cells.fl[cell],40+4*i);
    });
    const group = item.kind === "canal" ? "人工运河" : "regular";
    const type = item.kind === "canal" ? "运河" : "河流";
    const river = {i:id,source:course[0],mouth:last,parent:id,basin:id,
      discharge:cells.fl[last],length:api.Rivers.getApproximateLength(anchors),width:1,
      widthFactor:item.kind === "canal" ? .65 : 1.1,sourceWidth:.18,name:item.name,type,group,
      label:item.label === null ? {hidden:true} : {text:item.name},
      cells:course,points:anchors,note:noteFor(item),
      tags:[type,basinNames.get(item.basinKey)].filter(Boolean)};
    pack.rivers.push(river);
    byId.set(item.id,river);
    if (item.basinKey && !item.parentId && !basinRoots.has(item.basinKey) && item.kind!=="canal")
      basinRoots.set(item.basinKey,id);
  }
  for (const item of surface) {
    const river = byId.get(item.id);
    // A split or canal is not a tributary; only explicit natural inflows get a downstream parent.
    if(item.parentId && item.kind!=="canal") {
      const downstream = byId.get(item.parentId);
      if (!downstream) throw new Error("水道下游记录缺失："+item.name);
      api.Rivers.setParent(river.i,downstream.i);
    }
    if (item.basinKey && item.kind!=="canal") river.basin=basinRoots.get(item.basinKey) || river.basin;
  }
  api.Biomes.generate();
  for (const cell of cells.i) {
    const [x,y]=cells.p[cell];
    if(cells.h[cell]<20) continue;
    if(((x-137)/110)**2+((y-443)/63)**2<1 && cells.h[cell]<60) cells.biome[cell]=6;
    if(y>684 && x>185 && x<495 && cells.h[cell]<65) cells.biome[cell]=1;
  }
  api.Features.defineGroups();
  for (const f of pack.features) if (f?.i) {
    f.name = f.type === "ocean" ? "漩涡海" : f.type==="lake" ? "湖泊" : f.group==="continent" ? "曙光境" : "岛屿";
  }
  api.Goods.generate();
  api.Population.rankCells();
  for (const cell of cells.i) {
    if (cells.h[cell]<20) continue;
    const idx = atlas.states.findIndex(s => inside(cells.p[cell],s.polygon));
    cells.state[cell] = idx+1;
  }
  for (const [idx,state] of atlas.states.entries()) {
    const i=idx+1;
    pack.states.push({i,name:state.name,fullName:state.name,color:state.color,expansionism:1,
      capital:0,type:"Generic",center:0,culture:0,form:"Monarchy",formName:"Kingdom",
      coa:{t1:state.color},economy:structuredClone(neutral.economy),tags:[],
      diplomacy:Array.from({length:atlas.states.length+1},(_,j)=>j && i!==j?"Neutral":"x"),
      military:[],campaigns:[],provinces:[],alert:1});
  }
  for (const p of atlas.places) {
    const note = [p.desc,p.ref,p.phase,p.precision,p.aliases?.join("、")].filter(Boolean).join("　");
    let cell=api.Pack.requireCell(p.x,p.y), x=p.x, y=p.y;
    const markerTypes = {
      site:["据点","◆"], ruin:["遗址","◇"], island:["岛屿","△"],
      sea:["海域","≈"], landmark:["地理地标","◇"], region:["地区","✦"]
    };
    if (markerTypes[p.kind]) {
      const [type,glyph] = markerTypes[p.kind];
      pack.markers.push({i:pack.markers.length,type:p.markerType || type,icon:api.Icons.glyph(p.icon || glyph),
        x,y,cell,name:p.name,note,tags:[]});
      api.AddedLabels.place(x,y-9,p.displayName || p.name);
      continue;
    }
    if (cells.h[cell] < 20 || cells.burg[cell]) {
      const found = Array.from(cells.i).filter(c=>cells.h[c]>=20&&!cells.burg[c]);
      cell = found.reduce((a,b) => Math.hypot(cells.p[a][0]-x,cells.p[a][1]-y) <
        Math.hypot(cells.p[b][0]-x,cells.p[b][1]-y) ? a:b);
      [x,y]=cells.p[cell];
    }
    const owner=atlas.states.findIndex(s=>s.name===p.state)+1;
    cells.state[cell]=owner;
    const i=pack.burgs.length, capital=Number(Boolean(p.capital));
    pack.burgs.push({i,x,y,cell,name:p.name,culture:0,state:owner,capital,
      feature:cells.f[cell],port:p.kind==="port"?api.Burgs.getPortWater(cell):0,
      group:capital?"capital":p.kind==="city"?"city":p.kind==="fort"?"fort":"town",type:"Generic",
      population:capital?12:p.kind==="town"?1:5,coa:{t1:"#888888"},note,tags:[]});
    cells.burg[cell]=i;
    if(capital) Object.assign(pack.states[owner],{capital:i,center:cell});
  }
  for (const inset of atlas.insets || []) api.AddedLabels.place(inset.x+75,inset.y+17,inset.name+" · "+inset.caption);
  for (const r of atlas.regions) api.AddedLabels.place(r.x,r.y,r.name);
  for (const m of atlas.mountains) {
    const mid=m.label || m.points[Math.floor(m.points.length/2)];
    api.AddedLabels.place(mid[0],mid[1],m.name);
    let spacing=0;
    for (let i=1;i<m.points.length;i++) {
      const [x,y]=m.points[i];
      spacing+=Math.hypot(x-m.points[i-1][0],y-m.points[i-1][1]);
      if(spacing<12 || x<4 || y<4 || x>atlas.width-4 || y>atlas.height-4) continue;
      if(cells.h[api.Pack.findCell(x,y)]>=20) pack.relief.push({type:"mount",variant:1+i%4,x,y,s:8});
      spacing=0;
    }
  }
  api.States.getPoles();
  api.States.findNeighbors();
  api.States.collectStatistics();
  api.Routes.generate();
  const fixedRoutes = [...(atlas.roads || [])];
  if (atlas.railway) {
    const routeGroups = api.styles.routes.groups;
    routeGroups["铁路"] = structuredClone(routeGroups.roads);
    Object.assign(routeGroups["铁路"].attrs, {
      stroke:"#542a22", "stroke-width":2.4, "stroke-dasharray":"5 1.6", opacity:1
    });
    fixedRoutes.push(atlas.railway.line);
    for (const station of atlas.railway.stations) {
      hydroMarker([station.x,station.y],station.name,"铁路站点","□",noteFor(station));
      api.AddedLabels.place(...station.label,station.name);
    }
  }
  for (const road of fixedRoutes) {
    const points = road.points.map(point => [...point]);
    const port = pack.burgs.find(burg => burg?.name === road.to);
    if (port) points[points.length - 1] = [port.x, port.y];
    const routePoints = [points[0]];
    for (const anchor of points.slice(1)) {
      const start = api.Pack.requireCell(...routePoints.at(-1));
      const end = api.Pack.requireCell(...anchor);
      if (start === end) {
        routePoints[routePoints.length - 1] = anchor;
        continue;
      }
      const queue = [start];
      const previous = new Map([[start, null]]);
      for (let i = 0; i < queue.length && !previous.has(end); i++) {
        for (const neighbor of cells.c[queue[i]]) {
          if (cells.h[neighbor] < 20 || previous.has(neighbor)) continue;
          previous.set(neighbor, queue[i]);
          queue.push(neighbor);
        }
      }
      if (!previous.has(end)) throw new Error("Broken land route segment: " + road.name);
      const intermediate = [];
      for (let cell = previous.get(end); cell !== start; cell = previous.get(cell)) {
        intermediate.push(cells.p[cell]);
      }
      routePoints.push(...intermediate.reverse(), anchor);
    }
    const routeId = api.Routes.create(routePoints, road.kind === "rail" ? "铁路" : "roads");
    api.Routes.rename(routeId, road.name);
    const route = pack.routes.find(item => item.i === routeId);
    route.note = [road.desc, road.ref].join("　");
    route.lock = true;
    api.AddedLabels.place(...(road.nativeLabel || road.label), road.name);
  }
  for (const burg of pack.burgs.slice(1)) {
    if (Object.keys(cells.routes[burg.cell] || {}).length) continue;
    api.Routes.connect(burg.cell);
    if (Object.keys(cells.routes[burg.cell] || {}).length) continue;
    // Icy and highland cells can be impassable to the procedural route planner.
    // Join the settlement to a reachable overland trail on the native graph.
    const parent = new Map([[burg.cell,null]]), queue=[burg.cell];
    for(let j=0;j<queue.length;j++) {
      const at=queue[j];
      if(Object.keys(cells.routes[at]||{}).length) {
        const path=[];
        for(let c=at;c!==null;c=parent.get(c)) path.push(cells.p[c]);
        api.Routes.create(path.reverse(),"trails");
        break;
      }
      for(const neighbor of cells.c[at]) if(!parent.has(neighbor) && cells.h[neighbor]>=20) {
        parent.set(neighbor,at);
        queue.push(neighbor);
      }
    }
  }
  api.Development.generate();
  api.Markets.generate();
  api.Production.produce();
  api.Taxes.collect();
  api.Pack.markChanged();
  api.Layers.set(["ocean","landmass","lakes","states","rivers","relief","borders","coastline","routes","burgIcons","labels","markers","journeys"]);
  api.Layers.drawAll();
  return api.Services.Save.prepareMapData();
}
