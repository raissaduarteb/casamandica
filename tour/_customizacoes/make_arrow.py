"""Generate the floor-arrow sprite sheets for the Casa Mandica 3DVista tour.

Replaces the stock white ripple ring on the walk-to hotspots. Geometry must
match each original sheet exactly, or the player samples the wrong frames:
4 cols x 6 rows, 24 frames, row-major. Two frame heights are in use --
155px (the 1200x930 sheet, 132 copies) and 100px (the 1200x600 sheet, 4 copies).

Usage: make_arrow.py <out.png> <frame_height>
"""
import sys

from PIL import Image, ImageDraw

S = 4                      # supersample factor
FW = 300                   # frame width in the sheet
COLS, ROWS = 4, 6
NFRAMES = 24

FH = int(sys.argv[2])      # frame height: 155 or 100
K = FH / 155.0             # flatter sheets just squash the same drawing

SQ = 0.38 * K              # floor perspective squash (y compression)
CX, CY = 150.0, 92.0 * K   # where the point sits on the floor

OLIVE = (56, 64, 47)       # --ink #38402f
CREAM = (251, 250, 246)    # --paper #fbfaf6
WHITE = (255, 255, 255)


def floor(pt):
    """Map floor-plane coords (origin at the point) to frame pixels."""
    x, y = pt
    return ((CX + x) * S, (CY + y * SQ) * S)


def ease_in_out(t):
    return t * t * (3 - 2 * t)


def chevron(draw, dy, width, height, thick, color, alpha):
    """A V pointing away from the viewer, lying flat on the floor."""
    if alpha <= 0:
        return
    pts = [floor((-width, dy + height)), floor((0, dy)), floor((width, dy + height))]
    # The stroke reads mostly vertically, so it squashes with the floor plane.
    draw.line(pts, fill=color + (int(alpha * 255),), width=max(1, int(thick * K * S)), joint="curve")


def ellipse(draw, r, thick, color, alpha):
    if alpha <= 0:
        return
    x0, y0 = floor((-r, -r))
    x1, y1 = floor((r, r))
    draw.ellipse([x0, y0, x1, y1], outline=color + (int(alpha * 255),), width=max(1, int(thick * S)))


def make_frame(i):
    img = Image.new("RGBA", (FW * S, FH * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    p = i / NFRAMES  # 0..1 loop phase

    # Ground ripple: expands outward and fades. Anchors the arrow to the floor.
    rp = ease_in_out(min(1.0, p * 1.15))
    ellipse(d, 22 + rp * 96, 2.0, WHITE, (1 - rp) * 0.5)
    ellipse(d, 22 + rp * 96, 2.0, OLIVE, (1 - rp) * 0.28)

    # Arrow: bobs forward (away) and pulses, so the eye reads a direction.
    bob = ease_in_out(abs(1 - 2 * p))          # 1 -> 0 -> 1
    dy = 12 - bob * 10
    a = 0.55 + (1 - bob) * 0.45

    # Olive halo under a cream body: the halo carries light floors, the body
    # carries dark ones, so the arrow never sinks into the ground texture.
    chevron(d, dy, 46, 30, 19, OLIVE, a * 0.85)
    chevron(d, dy, 46, 30, 11, CREAM, a)
    return img.resize((FW, FH), Image.LANCZOS)


sheet = Image.new("RGBA", (FW * COLS, FH * ROWS), (0, 0, 0, 0))
for i in range(NFRAMES):
    r, c = divmod(i, COLS)
    sheet.paste(make_frame(i), (c * FW, r * FH))

sheet.save(sys.argv[1])
print("wrote", sys.argv[1], sheet.size)
