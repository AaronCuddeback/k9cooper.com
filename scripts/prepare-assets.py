"""
One-off asset preparation for the ESD K9 Cooper website.

Reads the original photographs / artwork supplied by the site owner and writes
web-optimised, correctly-oriented, sensibly-named files into /public/images.

Run with:  py scripts/prepare-assets.py
Requires:  Pillow  (py -m pip install Pillow)

This script is NOT part of the build. It is kept in the repo so the same
transformations can be re-run when new photographs are added.
"""
from PIL import Image, ImageOps
import os

SRC_DESKTOP = r"C:\Users\Opposition\Desktop"
SRC_COOPER = os.path.join(SRC_DESKTOP, "Cooper")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "images")

os.makedirs(OUT, exist_ok=True)


def load(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)  # honour EXIF orientation
    return im


def save_photo(im, rel, max_w, quality=82):
    """Resize to max width, save as .webp (primary) and .jpg (fallback/OG)."""
    im = im.convert("RGB")
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    im.save(p + ".webp", "WEBP", quality=quality, method=6)
    im.save(p + ".jpg", "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"  {rel}  {im.size}")
    return im.size


print("Photographs -------------------------------------------------")
# Head-and-shoulders portrait, vest patches visible. Primary "hero" photo.
# (Two exports of the same frame were supplied; the 8K one is the better source.)
save_photo(load(os.path.join(SRC_COOPER, "Cooper side web.jpg")), "cooper/cooper-portrait-vest", 2400)
# Cooper sitting indoors in ESD-K9 harness (portrait orientation).
save_photo(load(os.path.join(SRC_COOPER, "10258_compressed  (1).jpeg")), "cooper/cooper-sitting-indoors", 1400)
# Happy Cooper on a shaded path.
save_photo(load(os.path.join(SRC_COOPER, "20260822_100806.jpg")), "cooper/cooper-smiling-outdoors", 1600)
# Handler + Cooper, formal side-by-side.
save_photo(load(os.path.join(SRC_COOPER, "Cooper and Cuddeback2.jpg")), "cooper/cooper-and-handler", 1800)
# Handler + Cooper, eye-to-eye working moment.
save_photo(load(os.path.join(SRC_COOPER, "Cooper and Cuddeback3.jpg")), "cooper/cooper-and-handler-bond", 1800)
# Cooper at the El Dorado County Sheriff's Office entrance.
save_photo(load(os.path.join(SRC_COOPER, "20260817_131214.jpg")), "cooper/cooper-at-sheriffs-office", 1600)
# Illustrated Cooper at the Public Safety Complex sign.
save_photo(load(os.path.join(SRC_COOPER, "file_00000000e47081fdb0a929520b58ab37.png")), "cooper/cooper-public-safety-complex-art", 1400)

# --- Second batch of photographs supplied by the owner ---------------------
# Riding in the back of the vehicle, secured on his travel bed.
save_photo(load(os.path.join(SRC_DESKTOP, "20260817_082030.jpg")), "cooper/cooper-in-the-car", 1500)
# Head tilt on the park path. The most characterful of the walk shots.
save_photo(load(os.path.join(SRC_DESKTOP, "20260822_100803.jpg")), "cooper/cooper-head-tilt", 1500)
# Same walk, looking off to the side.
save_photo(load(os.path.join(SRC_DESKTOP, "20260822_100742.jpg")), "cooper/cooper-looking-out", 1500)
# Off duty, chin on a blanket.
save_photo(load(os.path.join(SRC_DESKTOP, "20260823_200233.jpg")), "cooper/cooper-off-duty-blanket", 1500)

print("Comic poster ------------------------------------------------")
poster = load(os.path.join(SRC_DESKTOP, "file_0000000051f081fdad47127b8b398842.png"))
save_photo(poster, "comic/cooper-comic-poster", 1086, quality=88)
W, H = poster.size  # 1086 x 1448
print(f"  poster source {W}x{H}")

# Crops taken from the poster. Fractional boxes so they survive a re-export.
crops = {
    # The five "Where Cooper Searches" panels (row starts ~0.385, ends ~0.63)
    "comic/panel-indoors":    (0.008, 0.386, 0.212, 0.625),
    "comic/panel-outdoors":   (0.212, 0.386, 0.410, 0.625),
    "comic/panel-vehicles":   (0.410, 0.386, 0.605, 0.625),
    "comic/panel-underwater": (0.605, 0.386, 0.800, 0.625),
    "comic/panel-buried":     (0.800, 0.386, 0.995, 0.625),
    # Third row story panels
    "comic/panel-how-it-works": (0.008, 0.632, 0.325, 0.828),
    "comic/panel-training":     (0.330, 0.632, 0.630, 0.828),
    "comic/panel-more-than":    (0.635, 0.632, 0.995, 0.828),
    # Bottom-left "what you can do" kids panel
    "comic/panel-kids-online":  (0.008, 0.836, 0.345, 0.972),
    # Hero Cooper (top-right seated figure)
    "comic/cooper-hero-seated": (0.555, 0.010, 0.995, 0.390),
}
for rel, (l, t, r, b) in crops.items():
    box = (round(l * W), round(t * H), round(r * W), round(b * H))
    save_photo(poster.crop(box), rel, 900, quality=86)

# NOTE: this script used to build brand/high-tech-crimes-unit-logo.png from the
# supplied unit artwork. It no longer does. The site is a personal, educational
# project and is not an official Sheriff's Office publication, so it does not
# carry the unit seal. The brand mark is Cooper's own face - see
# scripts/make-cooper-badge.mjs.

sticker = Image.open(os.path.join(SRC_DESKTOP, "file_00000000a8f481fd92fd4a16bc755920.png"))
save_photo(sticker.convert("RGB"), "comic/cooper-sticker-hide-the-thing", 900, quality=88)

print("Support -----------------------------------------------------")
qr = Image.open(os.path.join(SRC_DESKTOP, "A7DEEFAD-EF15-47C9-B637-DFEEB311CE3E_20260822173538.PNG")).convert("RGB")
qr = qr.resize((720, 740), Image.NEAREST)
qr.save(os.path.join(OUT, "support", "donation-qr-code.png"), "PNG", optimize=True)
print("  support/donation-qr-code.png", qr.size)

print("\nDone.")
