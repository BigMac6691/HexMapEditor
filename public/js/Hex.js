class Hex
{
    constructor(m, col, row, opts)
    {
        this.hexMap = m;
        this.col = col;
        this.row = row;
        this.opts = opts;

        this.use = SVG.createUse("hexagon", {id: `${col},${row}`, stroke: this.hexMap.borderColour, fill: opts?.hexFill ? opts.hexFill : this.hexMap.defaultHexFill});

        this.hexMap.map.append(this.use);
    }

    drawHex(x, y, w, h)
    {
        this.use.setAttribute("x", x);
        this.use.setAttribute("y", y);
        this.use.setAttribute("width", w);
        this.use.setAttribute("height", h);
    }
}