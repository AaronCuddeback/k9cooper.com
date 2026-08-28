"""
Illustrated Cooper poses -> transparent PNGs for the <CooperGuide> mascot and
for decorative use around the site.

Two problems with the supplied files, both handled here:

1. Seven of them have a "transparency" CHECKERBOARD baked into the pixels
   rather than a real alpha channel - two near-neutral greys, roughly
   #fefefe and #f1f1f1. Those are removed with a flood fill that starts from
   the image edges, so light areas INSIDE the artwork (white in the cape, pale
   fur highlights) are never touched.
2. The rest already have real alpha and only need trimming and resizing.

Both paths end the same way: trim to the artwork's bounding box, resize to a
sane web size, and write a PNG.

Run with:  py scripts/prepare-illustrations.py
Requires:  Pillow
"""
from PIL import Image, ImageFilter
import collections
import os

SRC = os.path.join(os.path.expanduser("~"), "Desktop", "HeroCooper")
OUT = os.path.join("public", "images", "guide")
os.makedirs(OUT, exist_ok=True)

# `max size` is the longest edge to keep. Nothing on the site renders this art
# above about 420 CSS px, so ~900px covers a 2x display with room to spare -
# anything larger is repo weight nobody downloads.
#  output name        source file                                    max size
POSES = [
    ("cooper-leap",     "ChatGPT Image Aug 23, 2026, 09_10_40 PM (1).png", 900),
    ("cooper-fly",      "ChatGPT Image Aug 23, 2026, 09_10_40 PM (2).png", 760),
    ("cooper-searching","ChatGPT Image Aug 23, 2026, 09_10_40 PM (3).png", 900),
    ("cooper-wave",     "ChatGPT Image Aug 23, 2026, 09_10_40 PM (4).png", 720),
    ("cooper-stand",    "ChatGPT Image Aug 23, 2026, 09_10_40 PM (5).png", 720),
    ("cooper-laptop",   "ChatGPT Image Aug 23, 2026, 09_23_20 PM (1).png", 720),
    ("cooper-peek",     "ChatGPT Image Aug 23, 2026, 09_23_20 PM (2).png", 560),
    ("cooper-shield",   "ChatGPT Image Aug 23, 2026, 09_23_20 PM (3).png", 900),
    ("cooper-tablet",   "ChatGPT Image Aug 23, 2026, 09_23_20 PM (4).png", 860),
    ("cooper-case",     "ChatGPT Image Aug 23, 2026, 09_23_21 PM (5).png", 720),
]


def looks_like_checkerboard(im: Image.Image) -> bool:
    """True when the border is dominated by two near-neutral light greys."""
    if im.mode == "RGBA" and im.getchannel("A").getextrema()[0] < 250:
        return False  # already has real transparency
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    counts = collections.Counter()
    for x in range(0, w, 2):
        counts[px[x, 1]] += 1
        counts[px[x, h - 2]] += 1
    for y in range(0, h, 2):
        counts[px[1, y]] += 1
        counts[px[w - 2, y]] += 1
    top = counts.most_common(4)
    neutral_light = sum(
        n for (r, g, b), n in top if min(r, g, b) > 225 and max(r, g, b) - min(r, g, b) < 12
    )
    return neutral_light > sum(n for _, n in top) * 0.8


def knockout_checkerboard(im: Image.Image) -> Image.Image:
    """Flood fill the baked checkerboard away, starting from the edges."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()

    def is_bg(x, y):
        r, g, b, _ = px[x, y]
        return min(r, g, b) > 225 and max(r, g, b) - min(r, g, b) < 14

    seen = bytearray(w * h)
    queue = collections.deque()

    def seed(x, y):
        if not seen[y * w + x] and is_bg(x, y):
            seen[y * w + x] = 1
            queue.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while queue:
        x, y = queue.popleft()
        px[x, y] = (255, 255, 255, 0)
        if x > 0:
            seed(x - 1, y)
        if x < w - 1:
            seed(x + 1, y)
        if y > 0:
            seed(x, y - 1)
        if y < h - 1:
            seed(x, y + 1)

    _remove_enclosed_checker(im)

    # Soften the one-pixel stair-stepping left by a hard flood fill.
    alpha = im.getchannel("A").filter(ImageFilter.GaussianBlur(0.6))
    im.putalpha(alpha)
    return im


def _remove_enclosed_checker(im: Image.Image) -> None:
    """
    Clear checkerboard trapped inside the artwork, which the edge fill cannot
    reach (for example the gap in the laptop lid).

    A region is only removed when it actually alternates between the two
    checker greys. A solid white highlight in the drawing uses one tone, so it
    survives; a checker patch uses both, so it goes.
    """
    w, h = im.size
    px = im.load()

    def candidate(x, y):
        r, g, b, a = px[x, y]
        return a > 0 and min(r, g, b) > 225 and max(r, g, b) - min(r, g, b) < 14

    seen = bytearray(w * h)
    for sy in range(h):
        for sx in range(w):
            if seen[sy * w + sx] or not candidate(sx, sy):
                continue
            stack = [(sx, sy)]
            seen[sy * w + sx] = 1
            cells = []
            while stack:
                x, y = stack.pop()
                cells.append((x, y))
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and candidate(nx, ny):
                        seen[ny * w + nx] = 1
                        stack.append((nx, ny))

            if len(cells) < 400:
                continue

            # Two distinct tones present in quantity => it is the checkerboard.
            light = sum(1 for x, y in cells if px[x, y][0] >= 248)
            dark = len(cells) - light
            minority = min(light, dark) / len(cells)
            if minority > 0.15:
                for x, y in cells:
                    px[x, y] = (255, 255, 255, 0)


print(f"  {'name':18s} {'source size':13s} {'method':14s} {'output':13s}")
for name, filename, max_size in POSES:
    path = os.path.join(SRC, filename)
    if not os.path.exists(path):
        print(f"  {name:18s} MISSING: {filename}")
        continue

    im = Image.open(path)
    src_size = im.size

    if looks_like_checkerboard(im):
        method = "checker-knock"
        im = knockout_checkerboard(im)
    else:
        method = "already alpha"
        im = im.convert("RGBA")

    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.thumbnail((max_size, max_size), Image.LANCZOS)

    # Flat-colour line art quantises almost losslessly and roughly halves the
    # file. The alpha channel is quantised separately and re-attached, because
    # Pillow's quantiser would otherwise flatten it.
    alpha = im.getchannel("A")
    flat = im.convert("RGB").quantize(colors=192, method=Image.MEDIANCUT, dither=Image.NONE)
    out_im = flat.convert("RGBA")
    out_im.putalpha(alpha)

    out_path = os.path.join(OUT, name + ".png")
    out_im.save(out_path, "PNG", optimize=True)

    kb = os.path.getsize(out_path) // 1024
    print(f"  {name:18s} {str(src_size):13s} {method:14s} {str(im.size):13s} {kb:5d} KB")

# Contact sheet on the site's cream so any leftover halo is obvious.
from PIL import ImageDraw  # noqa: E402

TILE, PAD, COLS = 230, 12, 5
rows = (len(POSES) + COLS - 1) // COLS
sheet = Image.new(
    "RGB",
    (COLS * (TILE + PAD) + PAD, rows * (TILE + PAD + 16) + PAD),
    (251, 245, 230),
)
d = ImageDraw.Draw(sheet)
for i, (name, _, _) in enumerate(POSES):
    f = os.path.join(OUT, name + ".png")
    if not os.path.exists(f):
        continue
    art = Image.open(f).convert("RGBA")
    art.thumbnail((TILE, TILE), Image.LANCZOS)
    x = PAD + (i % COLS) * (TILE + PAD) + (TILE - art.width) // 2
    y = PAD + (i // COLS) * (TILE + PAD + 16) + (TILE - art.height) // 2
    sheet.paste(art, (x, y), art)
    d.text(
        (PAD + (i % COLS) * (TILE + PAD), PAD + (i // COLS) * (TILE + PAD + 16) + TILE + 2),
        name,
        fill=(11, 11, 13),
    )
sheet.save(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_illustration-check.jpg"),
           "JPEG", quality=90)
print("\n  check: scripts/_illustration-check.jpg")
