class Hex
{
    constructor(m, col, row, opts)
    {
        this.hexMap = m;
        this.col = col;
        this.row = row;
        this.opts = opts;

        this.terrain = null;
        this.edges = null;
        this.connectors = null;
        this.meta = new Map();
        this.content = null;

        let id = `${col},${row}`;

        this.hexId = SVG.createText(id, {x: 500, y: 110, "font-size": "1em", "text-anchor": "middle", "alignment-baseline": "middle"});
        this.hexTerrain = SVG.createUse("hexagon", {id: id, stroke: this.hexMap.borderColour, "stroke-width": "2", fill: opts?.hexFill ? opts.hexFill : this.hexMap.defaultHexFill});
    }

    addToMap(map)
    {
        map.append(this.hexTerrain, this.hexId);

        return this;
    }

    drawHex(x, y, w, h)
    {
        if(arguments.length == 4)
        {
            this.hexTerrain.setAttribute("x", x);
            this.hexTerrain.setAttribute("y", y);
            this.hexTerrain.setAttribute("width", w);
            this.hexTerrain.setAttribute("height", h);
        }

        this.hexTerrain.setAttribute("fill", this.terrain?.data ? this.terrain.data.fill : this.hexMap.defaultHexFill);

        if(arguments.length == 4)
            this.drawId(x, y, w, h);
    }

    drawId(x, y, w, h)
    {
        this.hexId.setAttribute("x", `${x + w / 2}`);
        this.hexId.setAttribute("y", `${y + h * 0.21}`);
    }
}