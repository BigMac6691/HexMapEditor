class Hex
{
    constructor(m, col, row)
    {
        this.hexMap = m;
        this.col = col;
        this.row = row;
        this.svg = SVG.create("g");

        this.terrain = null;
        this.edges = null;
        this.corners = null;
        this.connectors = null;
        this.meta = null;
        this.content = null;

        let id = `${col},${row}`;

        this.hexId = SVG.createText(id, {x: 500, y: 110});
        this.hexTerrain = SVG.createUse("hexagon", {id: id, stroke: this.hexMap.borderColour, "stroke-width": "2", fill: this.hexMap.defaultHexFill});

        this.svg.append(this.hexTerrain, this.hexId);
    }

    setTerrain(value)
    {
        this.terrain = value;
        this.hexTerrain.setAttribute("fill", this.terrain?.data ? this.terrain.data.fill : this.hexMap.defaultHexFill);
    }

    addEdge(value) // {edge (none, river), index, variant}
    {
        if(value.edge === "None")
        {
            this.handleNone(this.edges, value);
            return;
        }

        if(!this.edges)
            this.edges = new Map();

        let edge = this.hexMap.edges.get(value.edge)[value.edgeIndex][value.variant];

        if(this.edges.has(edge.id))
            return;

        let n = SVG.createUse(edge.id, edge.svg);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.edges.set(edge.id, [value, n]);

        this.svg.append(this.edges.get(edge.id)[1]);
    }

    addCorner(value)
    {

    }

    addConnector(value) // {edge (none, rail), index, variant}
    {
        if(value.edge === "None")
        {
            this.handleNone(this.connectors, value);
            return;
        }

        if(!this.connectors)
            this.connectors = new Map();

        let connector = this.hexMap.connectors.get(value.edge)[value.edgeIndex][value.variant];

        if(this.connectors.has(connector.id))
            return;

        let n = SVG.createUse(connector.id, connector.svg);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.connectors.set(connector.id, [value, n]);

        this.svg.append(this.connectors.get(connector.id)[1]);
    }

    handleNone(map, value)
    {
        if(!map)
            return;

        for(const [k, v] of map)
        {
            if(v[0].edgeIndex === value.edgeIndex)
            {
                this.svg.removeChild(v[1]);
                map.delete(k);
                return;
            }
        }

        return;
    }

    drawHex(x, y, w, h)
    {
        if(arguments.length == 4)
        {
            this.hexTerrain.setAttribute("x", x);
            this.hexTerrain.setAttribute("y", y);
            this.hexTerrain.setAttribute("width", w);
            this.hexTerrain.setAttribute("height", h);

            if(this.edges)
                this.edges.forEach(edge =>
                {
                    if(edge)
                    {
                        edge[1].setAttribute("x", x);
                        edge[1].setAttribute("y", y);
                        edge[1].setAttribute("width", w);
                        edge[1].setAttribute("height", h);
                    }
                });
        }

        if(arguments.length == 4)
            this.drawId(x, y, w, h);
    }

    drawId(x, y, w, h)
    {
        this.hexId.setAttribute("x", `${x + w / 2}`);
        this.hexId.setAttribute("y", `${y + h * 0.21}`);
    }
}