---
layout: post
title: Palette Picker
categories: tools
published: true
# last_edit:
---

[paletton]: https://paletton.com/
[adobe-color-wheel]: https://color.adobe.com/create/color-wheel
[canva-color-wheel]: https://www.canva.com/colors/color-wheel/
[figma-color-wheel]: https://www.figma.com/color-wheel/
[wiki-color-scheme]: https://en.wikipedia.org/wiki/Color_scheme
[wiki-cielab]: https://en.wikipedia.org/wiki/CIELAB_color_space
[lch-article]: https://lea.verou.me/blog/2020/04/lch-colors-in-css-what-why-and-how/
[caniuse-oklch]: https://caniuse.com/wf-oklab
[oklab-paper]: https://bottosson.github.io/posts/oklab/
[srgb-transfer-function]: https://en.wikipedia.org/wiki/SRGB

This is a color picker I wrote based on the traditional color wheel as an educational exercise.  This tool provides a convenient way to interact with the ideas described in Wikipedia’s article on [Color Scheme][wiki-color-scheme].  All of the code can be viewed in the page source and is not obscured or minified.

As I explored this idea I looked at a few existing tools for inspiration. My goal here was not feature parity, but a simpler interaction model:
- [Adobe][adobe-color-wheel]
- [Canva][canva-color-wheel]
- [Figma][figma-color-wheel]

## My Goals

This tool prioritizes intuition over precision. It is intended for exploration rather than exact color science, and currently focuses on complementary, split, triadic, and monochromatic relationships derived from a single point on the wheel.

## Why LCH instead of HSL or RGB

For this picker I used OKLCH([Can I use OKLCH][caniuse-oklch]), which is derived from [CIELAB][wiki-cielab] which is designed to match human vision and perceptual uniformity. I chose a fixed, medium lightness and a high chroma value which is beyond what most displays can fully reproduce, meaning it will be downscaled. With hues evenly spaced around the spectrum, the resulting color wheel feels more evenly distributed to the eye than what you would get using HSL.


## Sampling colors from the canvas
In order to retrieve the colors I used a simple approach and sample the colors directly from the canvas. This means the hex values match what is rendered though it may be inaccurate near boundaries due to anti-aliasing and color interpolation.


## The tool

Without further ado, have fun playing with the wheel, click and/or drag around the wheel to select the base colors.  All other colors will be calculated automatically.

<div id="color-chooser" markdown="1">
<canvas id="color-wheel" width=370></canvas>
<canvas id="light-bar" width=30 height=370></canvas>

Selected
: <span id="selected"/>

Complement
: <span id="complement"/>

Split
: <span id="split1"/>
: <span id="split2"/>

Triadic
: <span id="triadic1"/>
: <span id="triadic2"/>

Monochromatic
: <span id="mono1"/>
: <span id="mono2"/>
: <span id="mono3"/>
: <span id="mono4"/>
: <span id="mono5"/>
: <span id="mono6"/>

</div>

<style>
    #color-chooser {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    #color-wheel {
        border-radius: 50%;
    }
    #light-bar {
        border-radius: 10px;
        border: 1px solid #ccc;
    }
    .color {
        display: inline-block;
        width: 1rem;
        height: 1rem;
    }
    
</style>

<script>
function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045
    ? c / 12.92
    : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToOklab(r, g, b) {
  r = srgbToLinear(r);
  g = srgbToLinear(g);
  b = srgbToLinear(b);

  const l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b;
  const m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b;
  const s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_,
    a: 1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_,
    b: 0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_,
  };
}

function oklabToOklch({ L, a, b }) {
  return {
    L,
    C: Math.sqrt(a*a + b*b),
    H: (Math.atan2(b, a) * 180 / Math.PI + 360) % 360
  };
}

function SelectableCanvas(canvas, {draw, selectXY}) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const listeners = [];
  
  canvas.addEventListener( "mousemove",  e => e.buttons && notify(e.offsetX, e.offsetY) );
  canvas.addEventListener( "click", e => notify(e.offsetX, e.offsetY) );
  
  function notify(x, y, origin = 'user') {
    clear();
    const selected = selectXY(x,y);
    listeners.forEach((listener) => listener({selected, origin}));
  }
  
  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  }
  
  return {
    ctx,
    clear,
    notify,
    rgbAt: (pos) => {
      const pixel = Array.from(ctx.getImageData(pos.x, pos.y, 1, 1).data);
      return {r: pixel[0], g: pixel[1], b: pixel[2]};
    },
    addEventListener: (listener) => listeners.push(listener)
  };
}

function LightBar(canvas) { 
  const { ctx, rgbAt, addEventListener, clear } = SelectableCanvas(canvas, { draw, selectXY});
  
  function setColor({r,g,b}) {
    lch = oklabToOklch(rgbToOklab(r, g, b));
    gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    for(let i = 0; i < 20; i++) {
      gradient.addColorStop(i/20, `oklch(${100-i*5}% ${lch.C} ${lch.H})`);
    }
    
    clear();
  }
  
  function selectXY(x,y) {
    lch = {
      ...lch,
      L: 1 - (y / canvas.height)
    };
    clear();
    return lch;
  }
  
  function draw() {
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    let y = canvas.height * (1 - lch.L);
    ctx.fillRect(0, y-2, canvas.width, 5);
  }
  
  let rgb = {r:255, g:255, b:255};
  let lch = oklabToOklch(rgbToOklab(rgb.r, rgb.g, rgb.b))
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, "black");
  
  draw();
  return {
      setColor,
      addEventListener,
  };
}

function ColorWheel(canvas) {
  const { ctx, rgbAt, addEventListener, clear, notify } = SelectableCanvas(canvas, { draw, selectXY });
  const size = canvas.height = canvas.width;
  const center = size / 2;
  
  function conicOKLCHGradient(L) {
    const conic = ctx.createConicGradient(0, center, center);
    const colors = Array.from({ length:18 }, (_,i) => `oklch(${L*100}% 0.2 ${i*20})`);
  
    [...colors, colors[0]].forEach(
      (col, i) => conic.addColorStop(i / 18, col));
    
    return conic
  }
  
  function radialGradient() {
    let radial = ctx.createRadialGradient(center, center, 0, center, center, center);
    radial.addColorStop(0, "white");
    radial.addColorStop(1, "transparent");
    
    return radial;
  }
  
  function rotate(pos, rads=Math.PI) {
      let x = pos.x-center;
      let y = pos.y-center;
      let cos = Math.cos(rads);
      let sin = Math.sin(rads);
      return {
          x: (x * cos - y * sin)+center,
          y: (x * sin + y * cos)+center
      };
  }
  
  // evenly space steps over the color wheel and choose the nearest index to the current pos
  function monochromaticSteps(pos) {
    let x = pos.x-center;
    let y = pos.y-center;
    
    let len = Math.sqrt((x*x) + (y*y));
    let theta = Math.atan2(y,x)
    
    let monoStep = center / 6;
    let monoDelta = len % monoStep;
    
    return Array.from( {length:6},
      (_,i) => {
        let step = i * monoStep + monoDelta;
        let x = (step * Math.cos(theta)) + center;
        let y = (step * Math.sin(theta)) + center;
        return [ `mono${i+1}`, { x, y }];
      }); 
  }
  
  
  function colorAt(pos) {
    const {r, g, b} = rgbAt(pos);
    let hex = (b) => b.toString(16).padStart(2, '0');
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }
  
  function drawCircle(pos, size) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
  
  function setL(L) {
    conic = conicOKLCHGradient(L);
    notify(selected.x, selected.y, 'external');
  }
  
  let radial = radialGradient();
  let conic = conicOKLCHGradient(.6);
  let selected = {x: center, y: center};
  
  function draw() {
    ctx.fillStyle = conic;
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();    
    
    ctx.fillStyle = radial;
    ctx.fill();
  }
  
  function selectXY(x,y) {
    selected = {x, y};
    
    let positions = [
      ["color", selected],
      ["complement", rotate(selected)],
      ["split1", rotate(selected, 2.61799)],
      ["split2", rotate(selected, 3.66519)],
      ["triadic1", rotate(selected, 2.0944)],
      ["triadic2", rotate(selected, 4.18879)],
      ...monochromaticSteps(selected)
    ];
    
    let colors = positions.map(([color, position]) => [color, colorAt(position)]);
    let pixel = Array.from(ctx.getImageData(selected.x, selected.y, 1, 1).data);
    
    drawCircle(selected, 10);
    positions.forEach(([_, position]) => drawCircle(position, 5));
    
    return {
      rgb: {r: pixel[0], g: pixel[1], b: pixel[2]},
      ...Object.fromEntries(colors)
    };
  }
  
  draw();
  return {
      setL,
      addEventListener,
  };
}

function colorBox(hex) {
    return `<span class="color" style="background:${hex}"></span>`;
}

const colorWheel = ColorWheel(document.querySelector("#color-wheel"));
const lightBar = LightBar(document.querySelector("#light-bar"));

const colorViews = [
  ['color', document.querySelector("#selected")],
  ['complement', document.querySelector("#complement")],
  ['split1', document.querySelector("#split1")],
  ['split2', document.querySelector("#split2")],
  ['triadic1', document.querySelector("#triadic1")],
  ['triadic2', document.querySelector("#triadic2")],
  ['mono1', document.querySelector("#mono1")],
  ['mono2', document.querySelector("#mono2")],
  ['mono3', document.querySelector("#mono3")],
  ['mono4', document.querySelector("#mono4")],
  ['mono5', document.querySelector("#mono5")],
  ['mono6', document.querySelector("#mono6")]
]

colorWheel.addEventListener(({selected, origin}) => {
    origin !== 'external' && lightBar.setColor(selected.rgb);
    colorViews.forEach(([field, element]) => {
      if(selected[field]) {
        element.innerHTML = `${colorBox(selected[field])} ${selected[field]}`; 
      }
    });
});

lightBar.addEventListener(({selected, origin}) => {
  origin !== 'external' && colorWheel.setL(selected.L);
});

</script>
