---
layout: post
title: Palette Picker
categories: tools
published: false
# last_edit:
needs-work: unpublished
---

[paletton]: https://paletton.com/
[adobe-color-wheel]: https://color.adobe.com/create/color-wheel
[canva-color-wheel]: https://www.canva.com/colors/color-wheel/
[figma-color-wheel]: https://www.figma.com/color-wheel/
[wiki-color-scheme]: https://en.wikipedia.org/wiki/Color_scheme

I thought it would be a fun and educational excercise to build myself a palette picker.

<canvas id="color-wheel" width=500 height=500 style="float:left"></canvas>

Selected
: <span id="selected"/>

Complimentary
: <span id="compliment"/>

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
: <span id="mono7"/>

<div style="clear: both"/>

<style>
    .color {
        display: inline-block;
        width: 1rem;
        height: 1rem;
    }
</style>

<script>
function ColorWheel(canvas) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width = canvas.height;
  const center = size / 2;

  const conic = ctx.createConicGradient(-2*Math.PI/3, center, center);
  const colors = [
    "#f00", // red
    "#808", // purple
    "#03f", // blue
    "#080", // green
    "#ff0", // yellow
    "#fa0"  // orange
  ];
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
  
  function scale(pos, factor) {
    let x = pos.x-center;
    let y = pos.y-center;
    
    let r = Math.sqrt((x*x) + (y*y));
    let theta = Math.atan2(y,x)
    
    let scale_r = r * factor;
    
    return {
      x: (scale_r * Math.cos(theta)) + center,
      y: (scale_r * Math.sin(theta)) + center,
    };
  }

  function colorAt(pos) {
      const pixel = Array.from(ctx.getImageData(pos.x, pos.y, 1, 1).data);
      return `#${pixel.slice(0,3).map(
              byte => byte.toString(16).padStart(2, '0'))
          .join("").toUpperCase()}`;
  }
  
  function selectColors(x,y) {
    const pos = {x: x, y: y};
    const len = length(pos);
    if(len > center || len < center/4) return {};
    drawCircle(pos, 10);
    
    function tx(position) {
      if(length(position) > center) return null;
      drawCircle(position, 5);
      return colorAt(position)
    }
    
    let mono = (len < center / 2) ? {
      mono1: tx(scale(pos, 3)),
      mono2: tx(scale(pos, 2.5)),
      mono3: tx(scale(pos, 2)),
      mono4: tx(scale(pos, 1.5)),
      mono5: tx(scale(pos, 0.5)),
      mono6: tx(scale(pos, 0.25)),
    } : {
      mono1: tx(scale(pos, 1.75)),
      mono2: tx(scale(pos, 1.5)),
      mono3: tx(scale(pos, 1.25)),
      mono4: tx(scale(pos, 0.75)),
      mono5: tx(scale(pos, 0.5)),
      mono6: tx(scale(pos, 0.25)),
    }
    
    return {
      color: tx(pos),
      compliment: tx(rotate(pos)),
      split1: tx(rotate(pos, 2.61799)),
      split2: tx(rotate(pos, 3.66519)),
      triadic1: tx(rotate(pos, 2.0944)),
      triadic2: tx(rotate(pos, 4.18879)),
      ...mono
    };
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
  ['compliment', document.querySelector("#compliment")],
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
const compliment = document.querySelector("#compliment");
function choose(x,y) {
    colorWheel.clear();
    const selected = colorWheel.selectColors(x,y);
    
    colorViews.forEach(([field, element]) => {
      if(selected[field]) {
        element.innerHTML = `${colorBox(selected[field])} ${selected[field]}`; 
      }
    });
}
colorWheel.canvas.addEventListener(
  "mousemove", 
  e => {
    if (e.buttons) choose(e.offsetX, e.offsetY);
  }
);
colorWheel.canvas.addEventListener(
  "click", 
  e => choose(e.offsetX, e.offsetY)
);
</script>
