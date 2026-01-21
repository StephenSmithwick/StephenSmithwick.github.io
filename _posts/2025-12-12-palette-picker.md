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

I thought it would be a fun and educational excercise to build myself a palette picker.

<canvas id="color-wheel" width=500 height=500 style="float:left"></canvas>

Selected
: <span id="selected"/>

Complimentary
: <span id="compliment"/>

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
  const overlay = document.createElement('canvas');
  [overlay.width, overlay.height] = [canvas.width, canvas.height];

  overlay.style.cssText = ` 
      position: absolute,
      left: 0px,
      top: 0px,
      pointerEvents: none,
      zIndex = ${(parseInt(window.getComputedStyle(canvas).zIndex) || 0) + 1}
  `;
  canvas.parentNode.appendChild(overlay);

  const ctx = canvas.getContext("2d");
  const octx = overlay.getContext("2d");
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

  function colorAt(pos) {
      const pixel = Array.from(ctx.getImageData(pos.x, pos.y, 1, 1).data);
      return `#${pixel.slice(0,3).map(
              byte => byte.toString(16).padStart(2, '0'))
          .join("").toUpperCase()}`;
  }
  
  function selectColors(x,y) {
    const pos = {x: x, y: y};
    drawCircle(pos, 10);
    
    function tx(position) {
      drawCircle(position, 5);
      return colorAt(position)
    }
    
    return {
      color: tx(pos),
      compliment: tx(rotate(pos)),
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
    ctx.clearRect(0, 0, overlay.width, overlay.height);
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
  ['compliment', document.querySelector("#compliment")]
]
const compliment = document.querySelector("#compliment");
colorWheel.canvas.addEventListener("click", (evt) => {
    colorWheel.clear();
    const selected = colorWheel.selectColors(evt.offsetX, evt.offsetY);
    
    colorViews.forEach(([field, element]) => {
      element.innerHTML = `${colorBox(selected[field])} ${selected[field]}`
    });
});
</script>
