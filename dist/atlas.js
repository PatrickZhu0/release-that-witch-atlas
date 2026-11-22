const icons={pen:'M4 20l4-1 12-12-3-3L5 16z M14.5 6.5l3 3',map:'M3 5l6-2 6 3 6-2v15l-6 2-6-3-6 2z M9 3v15m6-12v15',layers:'M12 3l9 5-9 5-9-5z M3 12l9 5 9-5 M3 16l9 5 9-5',download:'M12 3v12m-5-5 5 5 5-5 M4 16v4h16v-4',plus:'M5 12h14m-7-7v14',minus:'M5 12h14',fit:'M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5',forward:'M4 12h15m-6-6 6 6-6 6',x:'M6 6l12 12M6 18 18 6',book:'M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3z M12 6v15'};
const $=id=>document.getElementById(id);
icons.rail='M6 3h12v13H6z M6 9h12 M8 16l-3 5m11-5 3 5M8 13h1m6 0h1';
document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="'+icons[el.dataset.icon]+'"/></svg>'});
const editorURL=new URL('./editor/',location.href);
editorURL.searchParams.set('maplink',new URL('./release-that-witch.map?edition=railway',location.href).href);
$('edit').href=editorURL;
const kinds={city:'城市',fort:'要塞',town:'城镇',port:'港口',site:'据点',ruin:'遗址',island:'岛屿',sea:'海域',landmark:'地理地标',region:'地区'};
const summaries={'灰堡王国':'温布顿王室统治的南方王国。从边陲镇沿赤水河可前往柳叶镇和赤水城；长歌要塞位于支流上。','晨曦王国':'晨曦与灰堡接壤，王都为辉光城。北郡有道路通往赫尔梅斯圣城，东北一带以笼山为界。','狼心王国':'位于晨曦以北，东临海岸。狼心城是王国的都城，西侧可通往赫尔梅斯。','永冬王国':'四国中位置最北，赫尔梅斯以北是它的冰雪之地。图中保留王都在争王令初期的称谓。'};
const chapters={'灰堡王国':'第16、54、94章','晨曦王国':'第400、1051章','狼心王国':'第400、1051章','永冬王国':'第249、400章'};
const layerIds={states:['states','state-labels'],terrain:['terrain','mountain-labels'],waters:['waters','river-labels'],roads:['roads','road-labels'],rail:['railway'],places:['places']};
const modal=$('modal'),body=$('modalBody'),sheet=$('sheet'),drawing=$('drawing');
let data,svg,selected,realmName='',view={x:0,y:0,w:1200,h:820},gesture,ignoreClick=false,activePointers=new Map();
function make(tag,cls,txt){const el=document.createElement(tag);if(cls)el.className=cls;if(txt)el.textContent=txt;return el}
function dialog(title,tag){$('modalTitle').textContent=title;$('modalTag').textContent=tag;body.replaceChildren();if(!modal.open)modal.showModal()}
function clearModal(){if(modal.open)modal.close()}
$('close').onclick=clearModal;
modal.addEventListener('click',e=>{const r=modal.getBoundingClientRect();if(e.target===modal&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))clearModal()});
function notes(){dialog('制图说明','CARTOGRAPHIC NOTES');body.innerHTML='<div class="notes"><h3>这张图画的是哪个时期？</h3><p>四国颜色沿用争王令初期的政治格局，叠加小说后期与古代主要地点。边陲镇、长歌要塞和后来的无冬城均可搜索。区域示意表示原文可确定所属地区，具体点位仍待考。</p><h3>哪些位置有原文依据？</h3><p>第16章交代北坡山与绝境山脉的关系。第94章给出边陲镇与长歌要塞约54公里的直线距离。第400、884章说明四国如何经山路与赫尔梅斯相通。后文只用于补证地理关系。</p><p>海岸曲线、山体外形、岛屿数量、城镇点位及国界折线均为此次重绘的示意。图上距离不按统一比例换算。</p><h3>原作对照</h3><p><a href="https://www.qidian.com/chapter/1003306811/315842930/" target="_blank" rel="noreferrer">起点 · 作品相关《四大王国地图V2.0》</a><br><a href="https://www.webnovel.com/book/7931338406001705/21417334738996812" target="_blank" rel="noreferrer">原著第16章 · 授权英译</a><br><a href="https://www.readnovel.com/chapter/3922226004512203/11956023456847523" target="_blank" rel="noreferrer">原著第94章 · 边陲镇与长歌要塞</a></p><h3>编辑与保存</h3><p>打开 Azgaar 编辑器即可载入本图。通过编辑器的保存菜单下载 .map，可保留修改；首页的舆图为初始绘本。</p></div>'}
$('notes').onclick=notes;
$('export').onclick=()=>{dialog('导出地图','MAP EXPORT');for(const [file,name,desc] of [['four-kingdoms.svg','下载矢量舆图 · SVG','含完整中文标注，适合打印或放大查看。'],['later-railway.svg','下载铁路示意图 · SVG','含沃土铁路与主要站点。'],['release-that-witch.map','下载 Azgaar 工程 · MAP','在地图生成器内继续编辑地形、政区及聚落。']]){let a=make('a','download',name);a.href=file;a.download=file;a.append(make('small','',desc));body.append(a)}};
$('layers').onclick=()=>{const open=$('layerPanel').hidden;$('layerPanel').hidden=!open;$('layers').setAttribute('aria-expanded',String(open))};
document.querySelectorAll('[data-layer]').forEach(box=>box.onchange=()=>{
  for(const id of layerIds[box.dataset.layer]){
    const group=svg?.querySelector('#'+id);
    if(group)group.style.display=box.checked?'':'none';
  }
  if(box.dataset.layer==='rail') $('railControls').hidden=!box.checked;
});
function renderView(){if(!svg)return;svg.setAttribute('viewBox',[view.x,view.y,view.w,view.h].join(' '));$('percent').textContent=Math.round(data.width*100/view.w)+'%';$('minus').disabled=view.w>=data.width;svg.classList.toggle('catalog-quiet',view.w>data.width*.74);$('plus').disabled=view.w<=150}
function home(mobile=false){view=mobile&&window.innerWidth<=700?{x:290,y:138,w:580,h:590}:{x:0,y:0,w:data.width,h:data.height};renderView()}
function clampView(){view.x=Math.max(-view.w*.18,Math.min(data.width-view.w*.82,view.x));view.y=Math.max(-view.h*.18,Math.min(data.height-view.h*.82,view.y))}
function worldPoint(x,y){const p=new DOMPoint(x,y);return p.matrixTransform(svg.getScreenCTM().inverse())}
function zoom(factor,anchor){if(!svg)return;anchor??={x:view.x+view.w/2,y:view.y+view.h/2};const next=Math.max(150,Math.min(data.width,view.w*factor)),ratio=next/view.w;view={x:anchor.x+(view.x-anchor.x)*ratio,y:anchor.y+(view.y-anchor.y)*ratio,w:next,h:view.h*ratio};if(next===data.width)home();else{clampView();renderView()}}
$('plus').onclick=()=>zoom(.77);$('minus').onclick=()=>zoom(1.3);$('fit').onclick=()=>home();$('overview').onclick=()=>{clearModal();home();selectWater(data.rivers[0],false,false)};
const hydroKinds = {river:'天然河道',canal:'人工运河',underground:'地下水脉',inferred:'通航关系',note:'水文注记',road:'陆路转运',rail:'铁路干线','rail-station':'铁路站点'};
const basinNames = {red:'灰堡 · 赤水河','western-port':'灰堡 · 西境出海口',three:'灰堡 · 三湾河与北境水网',dawn:'晨曦 · 闪光河水网',winter:'永冬 · 旧圣城航路',silver:'极南境 · 银川',snow:'西境 · 雪山地下水',rail:'灰堡 · 后期铁路'};
function railRecords() {return data.railway ? [data.railway.line,...data.railway.stations] : []}
function waterRecords() {return [...data.rivers, ...data.waterNotes, ...(data.roads || []), ...railRecords()]}
function allPlaces() {return [...data.places, ...(data.catalogGeography || [])]}
function selectWater(item, focus = true, show = true) {
  if (!item) return;
  clearModal();
  const layer = item.basinKey === 'rail' ? 'rail' : item.kind === 'road' ? 'roads' : 'waters';
  const toggle = document.querySelector('input[data-layer="' + layer + '"]');
  if (!toggle.checked) {toggle.checked = true; toggle.onchange()}
  changeSelection(item);
  if (focus) {
    const points = item.points || [[item.x, item.y]];
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
    focusAt((left + right) / 2, (top + bottom) / 2, Math.min(data.width, Math.max(item.focusWidth || 270, (right-left)*1.3, (bottom-top)*1.9)));
  }
  if (show && window.innerWidth <= 700) mobileDetail();
}
function showHydrology() {
  if (!data) return;
  dialog('水系索引','HYDROGRAPHY');
  body.append(make('p','hydro-intro',data.hydroScope));
  for (const [key, name] of Object.entries(basinNames)) {
    if (key === 'rail') continue;
    body.append(make('h3','basin-title',name));
    const group = make('div','entries hydro-entries');
    for (const item of waterRecords().filter(r => r.basinKey === key)) {
      const button = make('button','', item.name);
      button.append(make('small','',hydroKinds[item.kind || 'note'] + ' · ' + item.ref));
      button.onclick = () => selectWater(item);
      group.append(button);
    }
    body.append(group);
  }
  const scope = make('details','hydro-scope');
  scope.append(make('summary','','未标出河线的记载'));
  scope.append(make('p','','沃土平原以北有联合会时代干涸的运河遗迹。第1453章记下了它们的状态，未给出可复原的走线。'));
  const link = make('a','','第1453章《黑石域之影》');
  link.href = data.hydroChapters[1453].url;
  link.target = '_blank'; link.rel = 'noreferrer';
  scope.append(link); body.append(scope);
}
$('hydro').onclick = showHydrology;
function updateRailStage() {
  const stageNumber=Number($('railStage').value);
  for(const part of svg.querySelectorAll('[data-rail-unlock]')){
    part.classList.toggle('rail-inactive',Number(part.dataset.railUnlock)>stageNumber);
  }
  $('railStageHint').textContent=data.railway.stages[stageNumber].hint;
}
function showRailway() {
  if(!data?.railway)return;
  dialog('后期铁路示意','RAILWAY');
  const {line,scope,comparison,comparisonChapters}=data.railway;
  const jump=make('button','rail-jump','在舆图上查看沃土铁路');
  jump.onclick=()=>selectWater(line,true,false);
  body.append(jump,make('p','hydro-intro',scope));
  const list=make('div','entries');
  for(const item of data.railway.stations){
    const button=make('button','',item.name);
    button.append(make('small','',item.ref));
    button.onclick=()=>selectWater(item);
    list.append(button);
  }
  body.append(list,make('p','hydro-intro',comparison),chapterLinks(comparisonChapters));
  const download=make('a','download','下载铁路示意图 · SVG');
  download.href='later-railway.svg';
  download.download='later-railway.svg';
  body.append(download);
}
function initializeRailway() {
  if(!data.railway)return;
  const stageSelector=$('railStage');
  for(const [i,stage] of data.railway.stages.entries()){
    const option=make('option','',stage.name);
    option.value=String(i);
    stageSelector.append(option);
  }
  stageSelector.value=String(data.railway.stages.length-1);
  stageSelector.onchange=updateRailStage;
  updateRailStage();
  document.querySelector('input[data-layer="rail"]').onchange();
}
$('railwayIndex').onclick=showRailway;
$('railAbout').onclick=showRailway;
function chapterLinks(chapterNumbers) {
  const refs = make('div','hydro-refs');
  for (const number of chapterNumbers) {
    const chapter = data.hydroChapters[number];
    const link = make('a','','第'+number+'章');
    link.title = chapter.title;
    link.setAttribute('aria-label','第'+number+'章《'+chapter.title+'》');
    link.href = chapter.url; link.target = '_blank'; link.rel = 'noreferrer';
    refs.append(link);
  }
  return refs;
}
function detail(el) {
  el.replaceChildren();
  if (!selected) return;
  if (selected.basinKey) {
    el.append(make('div','place-type',basinNames[selected.basinKey]+' · '+hydroKinds[selected.kind || 'note']),
      make('h3','detail-title',selected.name),make('p','detail-copy',selected.desc));
    el.append(chapterLinks(selected.chapters));
    return;
  }
  const realm = selected.polygon !== undefined;
  el.append(make('div','place-type',realm?'◆　四大王国':'⌖　'+(selected.catalogRegion || selected.state)+' · '+(selected.capital?'王都':kinds[selected.kind])),
    make('h3','detail-title',selected.displayName || selected.name),make('p','detail-copy',realm?summaries[selected.name]:selected.desc),
    selected.chapters ? chapterLinks(selected.chapters) : make('p','ref','原著 · '+(realm?chapters[selected.name]:selected.ref)));
  if (!realm && selected.precision) {
    el.append(make('p','ref',[selected.phase,selected.precision].filter(Boolean).join(' · ')));
    if (selected.aliases?.length) el.append(make('p','ref','别名 · '+selected.aliases.join('、')));
  }
}


function changeSelection(obj){selected=obj;realmName=obj.polygon?obj.name:obj.state;detail($('detail'));document.querySelectorAll('.realm').forEach(el=>{el.classList.toggle('active',el.dataset.name===realmName);el.setAttribute('aria-pressed',String(el.dataset.name===realmName))});svg?.querySelectorAll('[data-water]').forEach(el=>el.classList.toggle('selected',el.dataset.water===obj.id));svg?.querySelectorAll('[data-place]').forEach(el=>el.classList.toggle('selected',el.dataset.place===obj.name));$('mobileInfo').querySelector('span').textContent=obj.name}
function mobileDetail(){dialog(selected.name,'GAZETTEER');const card=make('article','mobile-details');detail(card);card.querySelector('h3').remove();body.append(card)}
$('mobileInfo').onclick=mobileDetail;
function focusAt(x,y,w){const h=w*data.height/data.width;view={x:x-w/2,y:y-h/2,w,h};clampView();renderView()}
function choosePlace(obj,focus=true,show=true){if(!obj)return;clearModal();changeSelection(obj);if(focus)focusAt(obj.x,obj.y,350);if(show&&window.innerWidth<=700)mobileDetail()}
function chooseRealm(obj){if(!obj)return;clearModal();changeSelection(obj);const xs=obj.polygon.map(p=>p[0]),ys=obj.polygon.map(p=>p[1]),x=(Math.max(...xs)+Math.min(...xs))/2,y=(Math.max(...ys)+Math.min(...ys))/2,w=Math.max(Math.max(...xs)-Math.min(...xs),(Math.max(...ys)-Math.min(...ys))*data.width/data.height);focusAt(x,y,Math.min(1150,w*1.15));if(window.innerWidth<=700)mobileDetail()}
function entries() {
  if (!data) return;
  dialog('地名索引','GAZETTEER');
  const q = make('input','search');
  q.type = 'search';
  q.placeholder = '搜索地名、别名或地区';
  q.setAttribute('aria-label',q.placeholder);
  const region = make('select','region-filter');
  region.setAttribute('aria-label','筛选地区');
  for (const name of ['全部地区', ...data.catalogRegions]) {
    const option = make('option','',name);
    option.value = name === '全部地区' ? '' : name;
    region.append(option);
  }
  const controls = make('div','catalog-controls');
  controls.append(q,region);
  const count = make('p','catalog-count');
  count.setAttribute('aria-live','polite');
  const list = make('div','entries');
  body.append(make('p','hydro-intro',data.catalogScope),controls,count,list);
  function update() {
    list.replaceChildren();
    const term = q.value.trim();
    const places = allPlaces();
    const shown = places.filter(place => {
      const searchText = [place.name,place.displayName,place.catalogRegion,...(place.aliases || [])].join(' ');
      return (!region.value || place.catalogRegion === region.value) && searchText.includes(term);
    });
    count.textContent = '显示 ' + shown.length + ' / ' + places.length + ' 处地点';
    for (const place of shown) {
      const button = make('button','',place.displayName || place.name);
      const details = [place.catalogRegion, place.capital ? '王都' : kinds[place.kind], place.phase].filter(Boolean);
      button.append(make('small','',details.join(' · ')));
      button.onclick = () => choosePlace(place);
      list.append(button);
    }
    if (!shown.length) list.append(make('p','','没有找到匹配的地名。'));
  }
  q.oninput = update;
  region.onchange = update;
  update();
  q.focus();
}
$('gazetteer').onclick=entries;$('allplaces').onclick=entries;
drawing.addEventListener('click',e=>{if(ignoreClick){ignoreClick=false;return}const w=e.target.closest('[data-water]');if(w){selectWater(waterRecords().find(item=>item.id===w.dataset.water),false);return}const p=e.target.closest('[data-place]');if(p)choosePlace(allPlaces().find(x=>x.name===p.dataset.place),false);else{const state=e.target.closest('[data-state]');if(state)chooseRealm(data.states.find(x=>x.name===state.dataset.state))}});
drawing.addEventListener('wheel',e=>{if(!svg)return;e.preventDefault();zoom(e.deltaY>0?1.13:.885,worldPoint(e.clientX,e.clientY))},{passive:false});
drawing.addEventListener('pointerdown',e=>{if(!svg||e.button!==0)return;activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(activePointers.size===2){const [a,b]=[...activePointers.values()];gesture={dist:Math.hypot(a.x-b.x,a.y-b.y)};ignoreClick=true}else{ignoreClick=false;gesture={x:e.clientX,y:e.clientY,view:{...view},scale:svg.getScreenCTM().a}}});
window.addEventListener('pointermove',e=>{if(!gesture||!activePointers.has(e.pointerId))return;activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(activePointers.size===2){const [a,b]=[...activePointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(gesture.dist&&d>1)zoom(gesture.dist/d,worldPoint((a.x+b.x)/2,(a.y+b.y)/2));gesture.dist=d;return}if(!gesture.view)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.hypot(dx,dy)<4&&!ignoreClick)return;ignoreClick=true;drawing.classList.add('moving');view={...gesture.view,x:gesture.view.x-dx/gesture.scale,y:gesture.view.y-dy/gesture.scale};clampView();renderView()});
function endPointer(e){if(!activePointers.delete(e.pointerId))return;if(activePointers.size===0){gesture=null;drawing.classList.remove('moving')}}
window.addEventListener('pointerup',endPointer);window.addEventListener('pointercancel',endPointer);
sheet.addEventListener('keydown',e=>{if(e.target!==sheet||!svg)return;const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(moves[e.key]){e.preventDefault();const[a,b]=moves[e.key];view.x+=a*view.w*.1;view.y+=b*view.h*.1;clampView();renderView()}if(e.key==='+')zoom(.77);if(e.key==='-')zoom(1.3);if(e.key==='Home')home()});
async function start(){const [d,s]=await Promise.all(['atlas-data.json','four-kingdoms.svg'].map(async f=>{const r=await fetch(f,{cache:'no-cache'});if(!r.ok)throw Error(f);return f.endsWith('json')?r.json():r.text()}));data=d;const doc=new DOMParser().parseFromString(s,'image/svg+xml');if(doc.querySelector('parsererror'))throw Error('SVG');svg=document.importNode(doc.documentElement,true);drawing.replaceChildren(svg);drawing.setAttribute('aria-busy','false');initializeRailway();for(const name of ['灰堡王国','晨曦王国','狼心王国','永冬王国']){const st=data.states.find(s=>s.name===name),b=make('button','realm');b.dataset.name=name;b.style.setProperty('--swatch',st.color);b.append(make('i'),make('span','',name),make('em','',st.en));b.onclick=()=>chooseRealm(st);$('realms').append(b)}home(true);const params=new URLSearchParams(location.search);const placeName=params.get('place');
const place=allPlaces().find(record=>record.name===placeName||record.aliases?.includes(placeName));
if(place){choosePlace(place,true,false);return}
const focus=params.get('focus');const item=focus&&waterRecords().find(record=>record.id===focus);
if(item)selectWater(item,true,false);
else choosePlace(data.places[0],false,false);}
start().catch(err=>{drawing.textContent='地图加载失败，请刷新重试。';console.error(err)});

