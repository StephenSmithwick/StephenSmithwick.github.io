---
layout: post
title:  My Palette Picker
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

<canvas id="color-wheel" width=300 height=300 style="float:left"></canvas>

Selected
: <span id="selected"/>

Complimentary
: <span id="complementary"/>

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

    const conic = ctx.createConicGradient(30, center, center);
    ["red", "yellow", "lime", "cyan", "blue", "magenta", "red"].forEach(
        (col, i) => conic.addColorStop(i / 6, col));
    
    ctx.fillStyle = conic;
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();

    // 2. Overlay White Center (Radial Gradient)
    const radial = ctx.createRadialGradient(center, center, 0, center, center, center);
    radial.addColorStop(0, "white");
    radial.addColorStop(1, "transparent");
    
    ctx.fillStyle = radial;
    ctx.fill();

    function rotate(x,y, rads=Math.PI/2) {
        let dx = x-center;
        let dy = y-center;
        return {
            x: center - dx * Math.cos(rads) - dy * Math.sin(rads),
            y: center - dx * Math.sin(rads) + dy * Math.cos(rads)
        };
    }

    function grabColor(x,y) {
        const pixel = Array.from(ctx.getImageData(x, y, 1, 1).data);
        return `#${pixel.slice(0,3).map(
                byte => byte.toString(16).padStart(2, '0'))
            .join("").toUpperCase()}`;
    }

    function grabComplementaryColor(x,y) {
        const rotated = rotate(x,y);
        return grabColor(rotated.x, rotated.y);
    }
    

    return {
        canvas,
        grabColor,
        grabComplementaryColor
    };
}



function colorBox(hex) {
    return `<span class="color" style="background:${hex}"></span>`;
}


const colorWheel = ColorWheel(document.querySelector("#color-wheel"));

const selected = document.querySelector("#selected");
const complementary = document.querySelector("#complementary");
colorWheel.canvas.addEventListener("click", (evt) => {
    const selectedColor = colorWheel.grabColor(evt.offsetX, evt.offsetY);
    const complementaryColor = colorWheel.grabComplementaryColor(evt.offsetX, evt.offsetY)

    selected.innerHTML = `${colorBox(selectedColor)}${selectedColor}`;
    complementary.innerHTML = `
        ${colorBox(selectedColor)}${selectedColor}</br>
        ${colorBox(complementaryColor)} ${complementaryColor}`;
});
</script>
