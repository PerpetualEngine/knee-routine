import cairosvg

SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" fill="#1D9E75"/>
<g fill="none" stroke="#fff" stroke-width="34" stroke-linecap="round" stroke-linejoin="round">
<circle cx="256" cy="110" r="42"/>
<polyline points="256,165 256,290"/>
<polyline points="256,290 200,380 215,450"/>
<polyline points="256,290 330,350 330,445"/>
<polyline points="256,190 190,250"/>
<polyline points="256,190 330,250"/>
</g></svg>"""

for size in (192, 512):
    cairosvg.svg2png(bytestring=SVG.encode(), write_to=f"icon-{size}.png", output_width=size, output_height=size)
