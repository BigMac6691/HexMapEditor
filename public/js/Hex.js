class Hex
{
    constructor(m, col, row, opts)
    {
        this.hexMap = m;
        this.col = col;
        this.row = row;
        this.opts = opts;

        this.terrain = null;

        let id = `${col},${row}`;

        this.hexId = SVG.createText(id, {x: 500, y: 110, "font-size": "1em", "text-anchor": "middle", "alignment-baseline": "middle"});
        this.use = SVG.createUse("hexagon", {id: id, stroke: this.hexMap.borderColour, "stroke-width": "2", fill: opts?.hexFill ? opts.hexFill : this.hexMap.defaultHexFill});
    }

    addToMap(map)
    {
        map.append(this.use, this.hexId);

        return this;
    }

    drawHex(x, y, w, h)
    {
        if(arguments.length == 4)
        {
            this.use.setAttribute("x", x);
            this.use.setAttribute("y", y);
            this.use.setAttribute("width", w);
            this.use.setAttribute("height", h);
        }

        this.use.setAttribute("fill", this.terrain ? this.terrain.fill : this.hexMap.defaultHexFill);

        if(arguments.length == 4)
            this.drawId(x, y, w, h);
    }

    drawId(x, y, w, h)
    {
        this.hexId.setAttribute("x", `${x + w / 2}`);
        this.hexId.setAttribute("y", `${y + h * 0.21}`);
    }
}