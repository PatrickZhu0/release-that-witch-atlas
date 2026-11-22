"""Engrave the printable map from the same coordinates used by the editor."""
from pathlib import Path
from math import cos, sin, pi, hypot, ceil
from html import escape
import json
import random


ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "dist/atlas-data.json").read_text(encoding="utf-8-sig"))
W, H = DATA["width"], DATA["height"]
rng = random.Random(817291)
art = []
occupied = []
ink = "#384338"
water_ink = "#406f70"


def n(value):
    return f"{value:.2f}".rstrip("0").rstrip(".")


def attrs(**items):
    return " ".join(f'{key.replace("_", "-")}="{escape(str(value), quote=True)}"'
                    for key, value in items.items() if value is not None)


def draw(tag, **items):
    art.append(f"<{tag} {attrs(**items)}/>")


def group(**items):
    art.append(f"<g {attrs(**items)}>")


def close():
    art.append("</g>")


def path(points, sealed=False):
    return "M" + " ".join(f"{n(x)},{n(y)}" for x, y in points) + ("Z" if sealed else "")


def point_inside(x, y, polygon):
    inside = False
    prior = polygon[-1]
    for p in polygon:
        if (p[1] > y) != (prior[1] > y) and x < (prior[0] - p[0]) * (y - p[1]) / (prior[1] - p[1]) + p[0]:
            inside = not inside
        prior = p
    return inside


def txt(x, y, s, cls, **extra):
    art.append(f'<text {attrs(x=n(x), y=n(y), **{"class": cls}, **extra)}>{escape(s)}</text>')


def overlap(a, b):
    return max(0, min(a[2], b[2]) - max(a[0], b[0])) * max(0, min(a[3], b[3]) - max(a[1], b[1]))


def score(box):
    outside = (max(0, 9 - box[0]) + max(0, box[2] - W + 9) +
               max(0, 9 - box[1]) + max(0, box[3] - H + 9))
    return outside * 10000 + sum(overlap(box, taken) for taken in occupied)


def best_center(x, y, width, above, below, candidates):
    best = None
    for rank, (dx, dy) in enumerate(candidates):
        xx, yy = x + dx, y + dy
        box = (xx-width/2, yy-above, xx+width/2, yy+below)
        cost = score(box) + rank * 0.4
        if best is None or cost < best[0]:
            best = (cost, xx, yy, box)
    occupied.append(best[3])
    return best[1:3]


land_d = "".join(path(p, True) for p in DATA["land"])
art.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="atlasTitle atlasDesc">')
art.append('<title id="atlasTitle">《放开那个女巫》四国地理图</title><desc id="atlasDesc">争王令时期的四国、峡湾与西境。海岸、国界和城市间距为原著地理关系示意。</desc>')
art.append('''<style>
text{font-family:"Songti SC","STSong","SimSun","Noto Serif CJK SC",serif;fill:#313e36}
.state-name,.region,.settlement,.water-name,.state-en,.terrain-name,.region-en{paint-order:stroke fill;stroke-linejoin:round;stroke-linecap:round}
.state-name{font-weight:bold;letter-spacing:3px;stroke:#efe5ce;stroke-width:3.4px}
.state-en,.region-en,.bearing{font-family:Georgia,"Times New Roman",serif;text-anchor:middle}
.state-en{font-style:italic;letter-spacing:1.7px;fill:#4c5445;font-size:11px;stroke:#e4dcc4;stroke-width:1.6px}
.settlement{font-weight:bold;font-size:13px;fill:#293c32;stroke:#efe8d4;stroke-width:3.8px}
.region{font-size:19px;font-weight:bold;letter-spacing:3px;fill:#4c6050;stroke:#dedcc6;stroke-width:2.2px;text-anchor:middle}
.region-en{font-style:italic;font-size:10px;letter-spacing:1.4px;fill:#4a6257;stroke:#dedcc6;stroke-width:1.6px}
.water-name,.terrain-name{font-size:13px;letter-spacing:1.2px;text-anchor:middle}
.water-name{fill:#255c6e;stroke:#f0ebd5;stroke-width:3.2px}
.water-note-name{font-size:12.5px;letter-spacing:.6px;text-anchor:middle;fill:#395e6a;paint-order:stroke fill;stroke:#f0ebd5;stroke-width:3.2px;stroke-linejoin:round}
.water-note-detail{font-size:10px;text-anchor:middle;fill:#3b5360;paint-order:stroke fill;stroke:#f0ebd5;stroke-width:3px;stroke-linejoin:round}
.settlement-detail{font-size:11.5px}
.settlement-region{font-size:16px;letter-spacing:1px}
.place-leader{stroke:#6f7969;stroke-width:.7;fill:none;pointer-events:none}
.inset-title{font-size:13px;font-weight:bold;fill:#344c44}
.inset-caption{font-size:10px;fill:#48695f}
.rail-line{stroke:#542a22;stroke-width:4.7;fill:none;stroke-linejoin:round;stroke-linecap:round}
.rail-sleepers{stroke:#fff3d8;stroke-width:2.6;stroke-dasharray:1.25 3.7;fill:none;pointer-events:none}
.rail-station-name{font-size:11.2px;font-weight:bold;text-anchor:middle;fill:#462622;paint-order:stroke fill;stroke:#f0ebd5;stroke-width:3.2px;stroke-linejoin:round}
.rail-inactive .rail-sleepers{display:none}
.rail-inactive .rail-line{stroke:#71584d;stroke-width:2;stroke-dasharray:4 4;opacity:.7}
.rail-symbol{fill:#fbefce;stroke:#542a22;stroke-width:1.65}
.rail-inactive .rail-symbol{fill:#f6f0e0;stroke:#856b58;stroke-dasharray:1.4 1.4}
.hydro-legend{font-size:13px;fill:#334e4b}
.hydro-legend-title{font-weight:bold;font-size:14px;letter-spacing:2px;fill:#334e4b}
.water-name.canal{fill:#365769}.water-name.underground{fill:#654c72}.water-name.inferred{fill:#7e4f31}
.water-feature,.water-annotation{cursor:pointer}
.road-label{fill:#6d4829;stroke:#f2ead0;stroke-width:3px;paint-order:stroke fill;stroke-linejoin:round;text-anchor:middle;font-size:13px;font-weight:bold}
.water-feature:hover .water-mark,.water-annotation:hover text{filter:brightness(.72)}
.terrain-name{fill:#5c604d;stroke:#e8dfc4;stroke-width:2.7px}
.bearing{font-size:14px;font-weight:bold;fill:#3f5e55}
.coast{fill:none;stroke-linejoin:round;stroke-linecap:round}
[data-place]{cursor:pointer}[data-place]:hover .settlement,[data-place]:focus .settlement{fill:#852f28}
</style>''')
art.append('<defs>')
art.append(f'<path id="landform" d="{land_d}"/><clipPath id="dry-land"><use href="#landform"/></clipPath>')
art.append('''<linearGradient id="sea" x2=".8" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#b7d2c6"/><stop offset="1" stop-color="#92bcb6"/></linearGradient>
<pattern id="grain" width="157" height="131" patternUnits="userSpaceOnUse">''')
for _ in range(235):
    draw("circle", cx=n(rng.uniform(0,157)), cy=n(rng.uniform(0,131)),
         r=n(rng.uniform(.18,.72)), fill=rng.choice(["#354c3e","#fff8dd"]), opacity=n(rng.uniform(.12,.28)))
art.append('</pattern><pattern id="soundings" width="109" height="71" patternUnits="userSpaceOnUse">')
for x,y in [(11,19),(63,48),(95,5)]:
    draw("path",d=f"M{x},{y}q3,2 6,0q3,2 6,0",fill="none",stroke="#487f79",stroke_width=".72",opacity=".37")
art.append('''</pattern><pattern id="survey-grid" width="84" height="84" patternUnits="userSpaceOnUse">
<path d="M0 0H84M0 0V84" fill="none" stroke="#4e7669" opacity=".17" stroke-width="1" stroke-dasharray="3 5"/>
<path d="M0 3V0H3M81 0H84V3M0 81V84H3M81 84H84V81" fill="none" stroke="#507569" stroke-width=".8" opacity=".5"/></pattern>''')
art.append('</defs>')
draw("rect", width=W, height=H, fill="url(#sea)")
draw("rect", width=W, height=H, fill="url(#soundings)")
for width, stroke, opacity in [(33,"#c0d6cb",.67),(32,"#577f72",.37),(30,"#c0d6cb",1),(21,"#688e7f",.57),(19,"#c9dbcc",1),(12,"#6e9585",.75),(10,"#d4deca",1),(5,"#708c76",.85)]:
    draw("use",href="#landform",**{"class":"coast"},stroke=stroke,stroke_width=width,opacity=opacity)
draw("use",href="#landform",fill="#d7d6b9")
group(id="states",clip_path="url(#dry-land)")
for state in DATA["states"]:
    draw("path",d=path(state["polygon"],True),fill=state["color"],stroke="#6b6b55",stroke_width="1.6",stroke_dasharray="4 2",stroke_linejoin="round",data_state=state["name"])
close()
draw("rect",width=W,height=H,fill="url(#survey-grid)",pointer_events="none")
draw("use",href="#landform",fill="none",stroke="#4c6758",stroke_width="2",stroke_linejoin="round",pointer_events="none")
group(id="terrain")
group(clip_path="url(#dry-land)")

# Short broken contours carry the relief of the frontier out from the ridge.
# Their position is decorative, so they stay below place and terrain labels.
for chain in DATA.get("mountains",[]):
    spine=chain["points"]
    for a,b in zip(spine[::4],spine[4::4]):
        dx,dy=b[0]-a[0],b[1]-a[1]
        length=hypot(dx,dy)
        if length<1:
            continue
        nx,ny=-dy/length,dx/length
        for side in [-1,1]:
            for _ in range(3):
                t=rng.random()
                offset=rng.uniform(16,36)*side
                x,y=a[0]+t*dx+nx*offset,a[1]+t*dy+ny*offset
                reach=rng.uniform(5,12)*side
                draw("path",d=f"M{n(x)},{n(y)}q{n(nx*reach*.7+dx*.13)},{n(ny*reach*.7+dy*.13)} {n(nx*reach+dx*.22)},{n(ny*reach+dy*.22)}",
                     fill="none",stroke="#73816c",stroke_width=".7",opacity=".4",stroke_linecap="round")


def engrave_peak(x, y, w, h):
    shift = rng.uniform(-.17,.17)*w
    ridge = [(x-w*.60,y),(x-w*.35,y-h*.27),(x-w*.32,y-h*.40),(x-w*.19,y-h*.53),(x+shift,y-h),
             (x+w*.16,y-h*.63),(x+w*.24,y-h*.55),(x+w*.32,y-h*.28),(x+w*.59,y)]
    toe = [(x+w*.18,y-1),(x-w*.12,y+1)]
    draw("path",d=path(ridge + toe,True),fill=rng.choice(["#d0c6a6","#cfc6a8","#d5cbad"]))
    outline = path(ridge)
    draw("path",d=outline,fill="none",stroke="#646958",stroke_width="1.15",stroke_linejoin="round")
    crest = [(x+shift,y-h),(x+w*.02,y-h*.67),(x+w*.09,y-h*.54),(x+w*.01,y-h*.39),(x+w*.09,y-h*.21),(x+w*.07,y-h*.11)]
    draw("path",d=path(crest+[(x+w*.38,y-1),(x+w*.59,y)]+ridge[5:8][::-1],True),fill="#89907a",opacity=".63")
    draw("path",d=path(crest),fill="none",stroke="#686c57",stroke_width=".63")
    for f in [.24,.38,.51,.65]:
        xx, yy = x+w*f*.35,y-h*(1-f)
        draw("path",d=f"M{n(xx)},{n(yy)}l{n(w*f*.38)},{n(h*f*.75)}",fill="none",stroke="#5f6d57",stroke_width=".52",opacity=".78")


peaks = []
for chain in DATA.get("mountains",[]):
    pts = chain["points"]
    for (x1,y1),(x2,y2) in zip(pts,pts[1:]):
        length=hypot(x2-x1,y2-y1)
        for i in range(ceil(length/15)):
            t = i/max(1,ceil(length/15))
            x, y = x1+t*(x2-x1), y1+t*(y2-y1)
            scale = .74 if "岭" in chain["name"] or "笼" in chain["name"] else 1
            peaks.append((x+rng.uniform(-5,5),y+rng.uniform(-4,4),rng.uniform(21,32)*scale,rng.uniform(16,29)*scale))
            if rng.random()<.68:
                peaks.append((x+rng.uniform(-14,14),y+rng.uniform(4,14),rng.uniform(12,21)*scale,rng.uniform(8,14)*scale))
for peak in sorted(peaks,key=lambda p:p[1]):
    engrave_peak(*peak)


def tree(x,y,size):
    sx,sy=n(x),n(y)
    group(transform=f"translate({sx} {sy}) scale({n(size)})")
    draw("path",d="M-3.6 1L-2.2-.8l-1 .2 1.8-2.4-.9.1L0-7l2 4.1-.9-.2L3.1-.6 2-.8 3.6 1 .3.1v2h-.6v-2Z",
         fill=rng.choice(["#738775","#83947b","#7c8e71"]),stroke="#586f5d",stroke_width=".52")
    close()


for region in DATA.get("regions",[]):
    if "森林" not in region["name"]:
        continue
    trees=[]
    for _ in range(165):
        angle = rng.random()*2*pi
        radius = rng.random()**.5 * (1+.13*cos(angle*3))
        xx = region["x"]+84*cos(angle)*radius
        yy = region["y"]+46*sin(angle)*radius
        trees.append((xx,yy,rng.uniform(.63,1.04)))
    for raw in sorted(trees,key=lambda p:p[1]):
        tree(*raw)
close()
close()
water_styles = {
    "river": ("天然河道", "#397e8d", 2.6, None),
    "canal": ("人工运河", "#476e7c", 4.3, None),
    "underground": ("地下水道", "#725780", 2.35, "5 4"),
    "inferred": ("通航关系示意", "#8d613f", 2.7, ".4 5"),
}


def water_path(points, kind):
    """Use interpolating curves for rivers. Every stated junction is on the line."""
    if kind != "river" or len(points) < 3:
        return path(points)
    d = path(points[:1])
    for i, (a, b) in enumerate(zip(points, points[1:])):
        prev, after = points[max(i-1,0)], points[min(i+2,len(points)-1)]
        ds = hypot(b[0]-a[0], b[1]-a[1])
        dp = hypot(a[0]-prev[0], a[1]-prev[1])
        dn = hypot(after[0]-b[0], after[1]-b[1])
        left = ds / (3 * (ds+dp)) if ds else 0
        right = ds / (3 * (ds+dn)) if ds else 0
        cp = [a[j]+left*(b[j]-prev[j]) for j in range(2)]
        cq = [b[j]-right*(after[j]-a[j]) for j in range(2)]
        d += f"C{n(cp[0])},{n(cp[1])} {n(cq[0])},{n(cq[1])} {n(b[0])},{n(b[1])}"
    return d


def water_stroke(d,kind):
    _,color,width,dash = water_styles[kind]
    draw("path",d=d,fill="none",stroke=color,stroke_width=width,stroke_dasharray=dash,
         stroke_linecap="round",stroke_linejoin="round",**{"class":"water-mark"})
    if kind == "canal":
        draw("path",d=d,fill="none",stroke="#ece7d0",stroke_width="1.25",
             stroke_linecap="round",stroke_linejoin="round")


def water_title(record):
    parts = [record.get(key) for key in ["name","desc","ref"]]
    art.append("<title>" + escape(" · ".join(part for part in parts if part)) + "</title>")


river_paths = [(r, water_path(r["points"],r.get("kind","river"))) for r in DATA.get("rivers",[]) if len(r["points"])>=2]
group(id="waters")
for r, d in river_paths:
    kind=r.get("kind","river")
    if kind in ("river","canal"):
        draw("path",d=d,fill="none",stroke="#ede8cd",stroke_width=water_styles[kind][2]+1.8,
             stroke_linecap="round",stroke_linejoin="round",pointer_events="none")
for r, d in river_paths:
    group(data_water=r.get("id",r["name"]),aria_label=r["name"],**{"class":"water-feature"})
    water_title(r)
    draw("path",d=d,fill="none",stroke="transparent",stroke_width="13",pointer_events="stroke",
         stroke_linejoin="round",stroke_linecap="round")
    water_stroke(d,r.get("kind","river"))
    close()
close()
group(id="roads")
for road in DATA.get("roads", []):
    group(data_water=road["id"], aria_label=road["name"], **{"class": "water-feature"})
    water_title(road)
    route = path(road["points"])
    draw("path", d=route, fill="none", stroke="transparent", stroke_width=14, pointer_events="stroke")
    draw("path", d=route, fill="none", stroke="#f2e7ca", stroke_width=5.8, stroke_linejoin="round")
    draw("path", d=route, fill="none", stroke="#8e5a36", stroke_width=2.9, stroke_dasharray="7 3",
         stroke_linecap="round", stroke_linejoin="round", **{"class": "water-mark"})
    close()
close()
draw("rect",width=W,height=H,fill="url(#grain)",pointer_events="none")


def compass(x,y):
    group(transform=f"translate({x} {y})", fill="none",stroke="#48695f",stroke_width=".85",pointer_events="none",opacity=".88")
    for radius in [20,24]:
        draw("circle",cx=0,cy=0,r=radius)
    for i in range(32):
        angle=i*pi/16
        r=23 if i%2 else 21
        draw("path",d=path([(cos(angle)*r,sin(angle)*r),(cos(angle)*25,sin(angle)*25)]))
    for i in range(8):
        length=32 if i%2==0 else 17
        group(transform=f"rotate({i*45})")
        draw("path",d=f"M0,0L-3.5,-4.5 0,-{length}Z",fill="#43695f")
        draw("path",d=f"M0,0L3.5,-4.5 0,-{length}Z",fill="#c3d5bf")
        close()
    draw("circle",cx=0,cy=0,r=2.4,fill="#dddbbb")
    txt(0,-39,"N","bearing",stroke="none")
    close()


# Choose open water for the compass, giving plotted locations priority.
compass_options=[(W-86,88),(W-88,H-92),(W-90,175),(W-170,74),(80,H-78)]
for cx,cy in compass_options:
    if all(not point_inside(cx+dx,cy+dy,p) for p in DATA["land"] for dx,dy in [(0,0),(32,0),(-32,0),(0,-40),(0,32)]):
        compass(cx,cy)
        occupied.append((cx-34,cy-54,cx+34,cy+34))
        break

for p in DATA["places"]:
    occupied.append((p["x"]-6,p["y"]-6,p["x"]+6,p["y"]+6))
for note in DATA.get("waterNotes",[]):
    occupied.append((note["x"]-5,note["y"]-5,note["x"]+5,note["y"]+5))
legend_x, legend_y = (W-657 if DATA.get("insets") else W-328),H-91
occupied.append((legend_x,legend_y,legend_x+310,H-15))
group(id="state-labels",pointer_events="none")
for state in DATA["states"]:
    x,y=state["label"]
    size=state.get("fontSize",27)
    en=state.get("en","")
    w=max((size+3)*len(state["name"]), len(en)*7)
    x,y=best_center(x,y,w,size,17,[(0,0),(0,-11),(0,11),(-15,0),(15,0),(0,-23),(0,23)])
    group(data_state=state["name"],pointer_events="auto",cursor="pointer")
    txt(x,y,state["name"],"state-name",text_anchor="middle",font_size=size)
    if en:
        txt(x,y+15,en.upper(),"state-en")
    close()
close()

for inset in DATA.get("insets", []):
    x,y,w,h = (inset[k] for k in ("x","y","w","h"))
    draw("rect",x=x,y=y,width=w,height=h,rx=3,fill="#e5eddc",stroke="#69847a",stroke_width="1.1")
    draw("path",d=f"M{x+10},{y+23}h{w-20}",stroke="#a5b5a2",stroke_width=".8")
    txt(x+11,y+17,inset["name"],"inset-title")
    txt(x+w-11,y+17,inset["caption"],"inset-caption",text_anchor="end")
    occupied.append((x,y,x+w,y+24))
group(id="places")
for p in sorted(DATA["places"],key=lambda p:(p.get("level")=="detail",not p.get("capital"),p["kind"] not in ["fort","port"])):
    x,y=p["x"],p["y"]
    name=p.get("displayName", p["name"])
    detail=p.get("level")=="detail"
    group(data_place=p["name"],data_level=p.get("level","overview"),aria_label=p["name"])
    art.append(f"<title>{escape(p['name']+' · '+p.get('precision','相对方位'))}</title>")
    draw("circle",cx=x,cy=y,r=6,fill="transparent")
    group(transform=f"translate({n(x)} {n(y)})",stroke="#3d4739",fill="#f4edcf",stroke_width="1.45",stroke_linejoin="round")
    if p.get("capital"):
        draw("circle",cx=0,cy=0,r=5.5)
        star=[((4.1 if i%2==0 else 1.7)*cos(-pi/2+i*pi/5),(4.1 if i%2==0 else 1.7)*sin(-pi/2+i*pi/5)) for i in range(10)]
        draw("path",d=path(star,True),fill="#505644",stroke="none")
    elif p["kind"]=="fort":
        draw("path",d="M-4 3.5V-3h2v1.5h1v-2h2v2h1V-3h2v6.5Z")
    elif p["kind"]=="site":
        draw("path",d="M0 -4.5L4 0 0 4.5 -4 0Z")
    elif p["kind"]=="ruin":
        draw("path",d="M-4 4V-3l3 1 2-2 3 1v7z M-1 4V0h2v4",fill="#ece1c8",stroke="#795849")
    elif p["kind"]=="island":
        draw("path",d="M-4 2 0-3 4 2z M-5 4h10",stroke="#285c5b")
    elif p["kind"]=="sea":
        draw("path",d="M-5-1q2.5-2 5 0t5 0m-10 4q2.5-2 5 0t5 0",fill="none",stroke="#285c5b")
    elif p["kind"]=="landmark":
        draw("path",d="M0-4 4 0 0 4-4 0Z",fill="none",stroke="#785b4b",stroke_dasharray="2 1")
    elif p["kind"]=="region":
        draw("path",d="M-3 0H3 M0-3V3",fill="none",stroke="#5c6a4b",stroke_width="1.25")
    elif p["kind"]=="port":
        draw("circle",cx=0,cy=0,r=3.2)
        draw("path",d="M0-5v10m-4-2q4 4 8 0",stroke_width="1.1",fill="none")
    else:
        draw("circle",cx=0,cy=0,r=3.2,fill="#58614a")
    close()
    font_size=16 if p["kind"]=="region" and not detail else 11.5 if detail else 13
    w=(font_size+.6)*len(name)
    default=(p.get("dx",8),p.get("dy",-6))
    options=[default,(8,-6),(8,13),(-8,-6),(-8,13),(8,4),(-8,4),(0,-10),(0,21),
             (8,-19),(-8,-19),(8,25),(-8,25),(0,-24),(0,33),(16,-13),(-16,-13),
             (13,35),(-13,35),(18,-34),(-18,-34),(0,48),(0,-42)]
    choices=[]
    for rank,(dx,dy) in enumerate(options):
        anchor="middle" if dx==0 else "end" if dx<0 else "start"
        left=x+dx-(w if dx<0 else w/2 if dx==0 else 0)
        box=(left-2,y+dy-font_size,left+w+2,y+dy+3)
        choices.append((score(box)+rank*.2,rank,dx,dy,anchor,box))
    _,_,dx,dy,anchor,box=min(choices)
    occupied.append(box)
    if abs(dy)>19 or abs(dx)>13:
        end_x=x+dx-(4 if dx>0 else -4 if dx<0 else 0)
        end_y=y+dy-(font_size if dy>0 else -2)
        draw("path",d=path([(x,y),(end_x,end_y)]),**{"class":"place-leader"})
    label_class="settlement"
    if p["kind"]=="region" and not detail:
        label_class+=" settlement-region"
    elif detail:
        label_class+=" settlement-detail"
    txt(x+dx,y+dy,name,label_class,text_anchor=anchor)
    close()
close()
group(id="region-labels",pointer_events="none")
for region in DATA.get("regions",[]):
    name=region["name"]
    x,y=region["x"],region["y"]
    en=region.get("en","")
    w=max(len(name)*22,len(en)*5.8)
    x,y=best_center(x,y,w,18,14 if en else 4,[(0,0),(0,-19),(0,18),(-20,0),(20,0),(0,35),(0,-35),(-35,14),(35,14)])
    cataloged=any(place["name"]==name for place in DATA.get("catalogGeography",[]))
    group(transform=f"rotate({region.get('angle',0)} {n(x)} {n(y)})",
          data_place=name if cataloged else None,pointer_events="all" if cataloged else None)
    txt(x,y,name,"region")
    if en:
        txt(x,y+14,en,"region-en")
    close()
close()
label_offsets=[(0,0),(0,-16),(0,16),(-14,-8),(14,-8),(-14,12),(14,12),(0,30),(0,-30),
               (-24,-16),(24,-16),(-24,16),(24,16),(-38,0),(38,0),(0,44),(0,-44)]
group(id="mountain-labels",pointer_events="none")
for obj in DATA.get("mountains",[]):
    pos=obj.get("label")
    if not pos:
        continue
    x,y=best_center(*pos[:2],len(obj["name"])*15,13,4,label_offsets)
    name=obj["name"]
    cataloged=any(place["name"]==name for place in DATA.get("catalogGeography",[]))
    txt(x,y,name,"terrain-name",transform=f"rotate({obj.get('angle',0)} {n(x)} {n(y)})",
        data_place=name if cataloged else None,pointer_events="all" if cataloged else None)
close()
group(id="river-labels")
for obj in DATA.get("rivers",[]):
    if not obj.get("label"):
        continue
    name = obj.get("displayName") or obj["name"]
    x,y=best_center(*obj["label"][:2],len(name)*14.5,14,4,label_offsets)
    group(data_water=obj.get("id",obj["name"]),aria_label=obj["name"],**{"class":"water-annotation"})
    water_title(obj)
    txt(x,y,name,"water-name "+obj.get("kind","river"),transform=f"rotate({obj.get('angle',0)} {n(x)} {n(y)})")
    close()
for obj in DATA.get("waterNotes",[]):
    x,y=obj["x"],obj["y"]
    name=obj.get("displayName") or obj["name"]
    note_pos=obj.get("label",[x,y-10])
    detail=obj.get("subLabel", "")
    width=max(len(name)*13.5,len(detail)*10)
    xx,yy=best_center(*note_pos[:2],width,13,15 if detail else 4,label_offsets)
    group(data_water=obj.get("id",obj["name"]),aria_label=obj["name"],**{"class":"water-annotation"})
    water_title(obj)
    draw("circle",cx=x,cy=y,r=9,fill="transparent")
    if obj.get("symbol") == "uncertain":
        draw("circle",cx=x,cy=y,r=4.2,fill="#f0ebd5",stroke="#326576",stroke_width="1.5",stroke_dasharray="2 1.6")
    else:
        draw("path",d=f"M{x},{n(y-4.5)}q-3.5,4 -3.5,6a3.5,3.5 0 1,0 7,0q0,-2 -3.5,-6Z",
             fill="#d9e7da",stroke="#326576",stroke_width="1.2")
    txt(xx,yy,name,"water-note-name")
    if detail:
        txt(xx,yy+12,detail,"water-note-detail")
    close()
group(id="hydro-legend",transform=f"translate({legend_x} {legend_y})",pointer_events="none")
draw("rect",width="310",height="75",rx="2",fill="#e5e9d5",fill_opacity=".93",stroke="#77968a",stroke_width=".8")
txt(12,19,"水系图例","hydro-legend-title")
draw("path",d="M86 14H297",fill="none",stroke="#a5b5a2",stroke_width=".75")
for index,(kind,(label,*_)) in enumerate(water_styles.items()):
    x,y=14+index%2*143,35+index//2*21
    water_stroke(f"M{x},{y}h29",kind)
    txt(x+38,y+4,label,"hydro-legend")
close()
close()
group(id="road-labels")
for road in DATA.get("roads", []):
    x, y = best_center(*road["label"], 88, 13, 4, [(0,0),(7,13),(-10,17),(-15,-10),(4,25)])
    group(data_water=road["id"], aria_label=road["name"], **{"class": "water-annotation"})
    water_title(road)
    txt(x, y, road["name"], "road-label")
    close()
close()
railway = DATA.get("railway")
if railway:
    group(id="railway")
    line = railway["line"]
    group(data_water=line["id"],aria_label=line["name"],**{"class":"water-feature"})
    water_title(line)
    for segment in line["segments"]:
        d=path(segment["points"])
        group(data_rail_unlock=segment["unlock"])
        draw("path",d=d,fill="none",stroke="transparent",stroke_width=13,pointer_events="stroke")
        draw("path",d=d,fill="none",stroke="#f7e9c6",stroke_width=6.5,stroke_linejoin="round",stroke_linecap="round")
        draw("path",d=d,**{"class":"rail-line"})
        draw("path",d=d,**{"class":"rail-sleepers"})
        close()
    close()
    for station in railway["stations"]:
        x,y=station["x"],station["y"]
        name=station["name"]
        sx,sy=station["label"]
        lx,ly=best_center(sx,sy,len(name)*12,12,4,label_offsets)
        group(data_water=station["id"],data_rail_unlock=station["unlock"],aria_label=name,
              **{"class":"water-annotation rail-stop"})
        water_title(station)
        draw("circle",cx=x,cy=y,r=7,fill="transparent")
        if hypot(lx-x,ly-y)>18:
            draw("path",d=path([(x,y),(lx,ly+(3 if ly<y else -11))]),**{"class":"place-leader"})
        draw("rect",x=n(x-3.9),y=n(y-3.9),width="7.8",height="7.8",rx="1.5",**{"class":"rail-symbol"})
        txt(lx,ly,name,"rail-station-name")
        close()
    close()
art.append("</svg>")
(ROOT/"dist/four-kingdoms.svg").write_text("\n".join(art),encoding="utf-8")

if railway:
    base_map = art[1:-1]
    art = ['''<svg xmlns="http://www.w3.org/2000/svg" width="1110" height="816" viewBox="0 0 1110 816" role="img" aria-labelledby="rail-title">
<title id="rail-title">《放开那个女巫》后期铁路示意图</title>
<style>
#rail-focus #places [data-place]:not([data-place="塔其拉"]):not([data-place="无冬城"]):not([data-place="北坡矿场"]):not([data-place="爱葛莎试验石塔"]){display:none}
#rail-focus #region-labels{opacity:.8}
#rail-focus #state-labels,#rail-focus #road-labels,#rail-focus #roads,#rail-focus #river-labels,#rail-focus #mountain-labels{display:none}
#rail-poster .rail-body{font-size:15px;fill:#354b42}
#rail-poster .rail-anchor{font-size:19px;font-weight:bold;fill:#203e32}
#rail-poster .rail-caption{font-size:13px;letter-spacing:1.4px;fill:#617568}
</style><g id="rail-poster">''']
    draw("rect",width=1110,height=816,fill="#f5f1df")
    draw("rect",width=1110,height=9,fill="#244738")
    txt(38,48,"《放开那个女巫》","rail-caption")
    txt(35,98,"后期铁路示意图","rail-anchor",style="font-size:42px;letter-spacing:2px")
    txt(38,127,"沃土铁路 · 无冬城至塔其拉附近","rail-body")
    draw("rect",x=36,y=151,width=650,height=598,fill="#d6dfcc",stroke="#60786b",stroke_width="1.4")
    art.append('<svg id="rail-focus" x="37" y="152" width="648" height="596" viewBox="0 214 392 360" preserveAspectRatio="xMidYMid meet">')
    art.extend(base_map)
    art.append("</svg>")
    def poster_lines(y, heading, lines):
        txt(720,y,heading,"rail-anchor")
        for i,value in enumerate(lines,1):
            txt(720,y+i*25,value,"rail-body")
    poster_lines(175,"试车与开工",["第921、959章","无冬城北坡矿区展示铁轨。首列蒸汽","火车在无冬城公开试运行。"])
    poster_lines(309,"从森林推进",["第966、1077、1080章","第966章时轨道仅铺至森二号站前方。","出林后向东北、再向塔其拉方向延伸，","依次经过塔零号与塔一号站。"])
    poster_lines(463,"站点抵达塔其拉附近",["第1154、1231、1450章","塔十号是火炬行动计划的终点站。","到小说终盘，原文已描写塔十号站。"])
    draw("path",d="M720,574H1068",stroke="#b6b9a2",stroke_width="1")
    poster_lines(608,"跨国运输",["第1231章讨论直达晨曦的铁路。","第1337章实际贯通的是经笼山关口的","南北大动脉水泥公路。"])
    draw("path",d="M722,733H751",**{"class":"rail-line"})
    draw("path",d="M722,733H751",**{"class":"rail-sleepers"})
    txt(764,738,"沃土铁路","rail-body")
    draw("rect",x=899,y=728,width=9,height=9,rx=1.5,**{"class":"rail-symbol"})
    txt(919,738,"原著所述站点","rail-body")
    txt(38,787,"相对方位示意 · 未按里程换算","rail-caption")
    art.append("</g></svg>")
    (ROOT/"dist/later-railway.svg").write_text("\n".join(art),encoding="utf-8")
