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
[caniuse-lch]: https://caniuse.com/css-lch-lab

This is a color picker I wrote based on the traditional color wheel as an educational exercise.  This tool provides a convenient way to interact with the ideas described in Wikipedia’s article on [Color Scheme][wiki-color-scheme].  All of the code can be viewed in the page source and is not obscured or minified.

As I explored this idea I looked at a few existing tools for inspiration. My goal here was not feature parity, but a simpler interaction model:
- [Adobe][adobe-color-wheel]
- [Canva][canva-color-wheel]
- [Figma][figma-color-wheel]

## My Goals

This tool prioritizes intuition over precision. It is intended for exploration rather than exact color science, and currently focuses on complementary, split, triadic, and monochromatic relationships derived from a single point on the wheel.

## Why LCH instead of HSL or RGB

For this picker I used LCH([Can I use LCH][caniuse-lch]), which is derived from [CIELAB][wiki-cielab] which is designed to match human vision and perceptual uniformity. I chose a fixed, medium lightness and a high chroma value which is beyond what most displays can fully reproduce, meaning it will be downscaled. With hues evenly spaced around the spectrum, the resulting color wheel feels more evenly distributed to the eye than what you would get using HSL.


## Sampling colors from the canvas
In order to retrieve the colors I used a simple approach and sample the colors directly from the canvas. This means the hex values match what is rendered though it may be inaccurate near boundaries due to anti-aliasing and color interpolation.


## The tool

Without further ado, have fun playing with the wheel, click and/or drag around the wheel to select the base colors.  All other colors will be calculated automatically.

<div id="color-chooser" markdown="1">
<canvas id="color-wheel" width=370></canvas>

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
    .color {
        display: inline-block;
        width: 1rem;
        height: 1rem;
    }
</style>

<script>
function ColorWheel(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const size = canvas.height = canvas.width;
  const center = size / 2;

  const conic = ctx.createConicGradient(0, center, center);
  // Choose 6 colors that are evenly spaced perceptually using lch for the colorwheel's gradient
  const colors = Array.from({ length:6 }, (_,i) => `lch(60% 132 ${i*60}`); 

  [...colors, colors[0]].forEach(
      (col, i) => conic.addColorStop(i / 6, col));
  
  const radial = ctx.createRadialGradient(center, center, 0, center, center, center);
  radial.addColorStop(0, "white");
  radial.addColorStop(1, "transparent");
  
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
  
  function length(pos) {
    let x = pos.x-center;
    let y = pos.y-center;
    
    return Math.sqrt((x*x) + (y*y));
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
        return [ `mono${i+1}`, {
          x: (step * Math.cos(theta)) + center,
          y: (step * Math.sin(theta)) + center,
        }];
      }); 
  }
  
  function colorAt(pos) {
    if(length(pos) > center) return null;
    const pixel = Array.from(ctx.getImageData(pos.x, pos.y, 1, 1).data);
    return `#${pixel.slice(0,3).map(
            byte => byte.toString(16).padStart(2, '0'))
        .join("").toUpperCase()}`;
  }
  
  function selectColors(x,y) {
    const pos = {x: x, y: y};
    if(length(pos) > center ) return {};
    
    let positions = [
      ["color", pos],
      ["complement", rotate(pos)],
      ["split1", rotate(pos, 2.61799)],
      ["split2", rotate(pos, 3.66519)],
      ["triadic1", rotate(pos, 2.0944)],
      ["triadic2", rotate(pos, 4.18879)],
      ...monochromaticSteps(pos)
    ];
    
    let colors = positions.map(([color, position]) => [color, colorAt(position)]);
    
    drawCircle(pos, 10);
    positions.forEach(([_, position]) => drawCircle(position, 5));
    
    return Object.fromEntries(colors);
  }
  
  function draw() {
    ctx.fillStyle = conic;
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();    
    
    ctx.fillStyle = radial;
    ctx.fill();
  }
  draw();
  
  function drawCircle(pos, size) {
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
  
  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  }

  return {
      canvas,
      selectColors,
      clear,
  };
}

function colorBox(hex) {
    return `<span class="color" style="background:${hex}"></span>`;
}

const colorWheel = ColorWheel(document.querySelector("#color-wheel"));

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
const complement = document.querySelector("#complement");
function colorSelectHandler(e) {
    colorWheel.clear();
    const selected = colorWheel.selectColors(e.offsetX, e.offsetY);
    
    colorViews.forEach(([field, element]) => {
      if(selected[field]) {
        element.innerHTML = `${colorBox(selected[field])} ${selected[field]}`; 
      }
    });
}
colorWheel.canvas.addEventListener(
  "mousemove", 
  e => {
    if (e.buttons) colorSelectHandler(e);
  }
);
colorWheel.canvas.addEventListener(
  "click", 
  e => colorSelectHandler(e)
);
</script>
