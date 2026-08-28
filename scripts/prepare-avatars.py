"""
Square face crops of Cooper used by the <CooperGuide> mascot component.

These render as CIRCLES on the site, so the crop is tuned for the inscribed
circle rather than the square: Cooper's head is centred in the circle with a
little breathing room all round.

Each pose is (source, cx, cy, size):

    cx, cy   where to centre the crop, as fractions of the FULL image
    size     side of the square crop, as a fraction of the image's SHORTER edge

HOW TO ADJUST A CROP
--------------------
1. Run this script and open `scripts/_avatar-check.jpg`. It shows
   each avatar with the real circular mask and a 10% grid, so you can read off
   exactly where Cooper's head sits inside the circle.
2. If his head sits at, say, 44% across instead of 50%, correct it with:

       new_cx = cx + (0.44 - 0.50) * size_x     where size_x = side_px / image_width
       new_cy = cy + (0.44 - 0.50) * size_y     where size_y = side_px / image_height

   The script prints side_px, size_x and size_y for you.
3. Re-run and look again. Two passes is normally enough.

Run with:  py scripts/prepare-avatars.py
"""
from PIL import Image, ImageDraw, ImageOps
import os

OUT = os.path.join("public", "images", "cooper")
DESKTOP = os.path.join(os.path.expanduser("~"), "Desktop")

SOURCES = {
    "front": os.path.join(DESKTOP, "20260822_100806.jpg"),
    "tilt": os.path.join(DESKTOP, "20260822_100803.jpg"),
    "left": os.path.join(DESKTOP, "20260822_100742.jpg"),
    "car": os.path.join(DESKTOP, "20260817_082030.jpg"),
    "blanket": os.path.join(DESKTOP, "20260823_200233.jpg"),
    "office": os.path.join(DESKTOP, "Cooper", "20260817_131214.jpg"),
}

#  name                     source      cx     cy     size
POSES = {
    "cooper-face-alert":   ("front",   0.549, 0.463, 0.692),
    "cooper-face-happy":   ("tilt",    0.487, 0.445, 0.859),
    "cooper-face-working": ("car",     0.445, 0.368, 0.372),
    "cooper-face-duty":    ("office",  0.500, 0.460, 0.210),
    "cooper-face-resting": ("blanket", 0.377, 0.455, 0.603),
    "cooper-face-curious": ("left",    0.510, 0.450, 0.795),
}


def load(key: str) -> Image.Image:
    return ImageOps.exif_transpose(Image.open(SOURCES[key])).convert("RGB")


sources = {k: load(k) for k in SOURCES}
results = []

print(f"  {'pose':16s} {'source':9s} {'side':>6s}  {'size_x':>7s} {'size_y':>7s}")
for name, (key, cx, cy, size) in POSES.items():
    im = sources[key]
    W, H = im.size
    side = min(round(min(W, H) * size), W, H)

    left = max(0, min(W - side, round(cx * W - side / 2)))
    top = max(0, min(H - side, round(cy * H - side / 2)))

    crop = im.crop((left, top, left + side, top + side)).resize((512, 512), Image.LANCZOS)
    crop.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=88, method=6)
    crop.save(os.path.join(OUT, name + ".jpg"), "JPEG", quality=88, optimize=True)

    short = name.replace("cooper-face-", "")
    print(f"  {short:16s} {key:9s} {side:6d}  {side / W:7.3f} {side / H:7.3f}")
    results.append((short, crop))

# ---------------------------------------------------------------------------
# Verification sheet: the real circular mask, plus a 10% grid and a centre
# crosshair so the head's position can be read off precisely.
# ---------------------------------------------------------------------------
TILE, PAD = 300, 18
sheet = Image.new(
    "RGB",
    (len(results) * (TILE + PAD) + PAD, TILE + PAD * 2 + 16),
    (244, 233, 207),
)
mask = Image.new("L", (TILE, TILE), 0)
ImageDraw.Draw(mask).ellipse((0, 0, TILE - 1, TILE - 1), fill=255)
d = ImageDraw.Draw(sheet)

for i, (name, crop) in enumerate(results):
    x = PAD + i * (TILE + PAD)
    circle = Image.new("RGB", (TILE, TILE), (244, 233, 207))
    circle.paste(crop.resize((TILE, TILE), Image.LANCZOS), (0, 0), mask)
    sheet.paste(circle, (x, PAD))

    # 10% grid across the whole square, labelled.
    for f in range(1, 10):
        gx = x + TILE * f / 10
        gy = PAD + TILE * f / 10
        colour = (255, 40, 40) if f == 5 else (255, 255, 255)
        width = 2 if f == 5 else 1
        d.line([(gx, PAD), (gx, PAD + TILE)], fill=colour, width=width)
        d.line([(x, gy), (x + TILE, gy)], fill=colour, width=width)
        if f in (2, 4, 6, 8):
            d.text((gx + 2, PAD + 2), str(f * 10), fill=(255, 255, 0))
            d.text((x + 2, gy + 1), str(f * 10), fill=(80, 255, 80))

    d.ellipse((x, PAD, x + TILE - 1, PAD + TILE - 1), outline=(11, 11, 13), width=4)
    d.text((x + 4, PAD + TILE + 4), name, fill=(11, 11, 13))

check_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_avatar-check.jpg")
sheet.save(check_path, "JPEG", quality=92)
print("\n  check:", check_path)
