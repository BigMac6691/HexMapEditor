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
        this.metadata = null;
        this.content = null;

        let id = `${col},${row}`;

        this.hexId = SVG.createText(id, {x: 500, y: 110});
        this.hexTerrain = SVG.createUse("hexagon", {id: id, stroke: this.hexMap.borderColour, "stroke-width": "2", fill: this.hexMap.defaultHexFill});

        this.svg.append(this.hexTerrain, this.hexId);
    }

    setTerrain(value)
    {
        this.terrain = value.type;
        this.hexTerrain.setAttribute("fill", this.hexMap.terrain.has(value.type) ? 
                                                this.hexMap.terrain.get(value.type)[value.variant].fill : 
                                                this.hexMap.defaultHexFill);
    }

    addEdge(value) // {edge (none, river), index, variant}
    {
        if(value.edge === "None")
        {
            this.handleNone(this.edges, value);
            return;
        }

        if(!this.edges)
            this.edges = new KOMap();

        if(this.edges.partialHas(value))
            return;

        let n = SVG.createUse(`${value.edge}_e${value.edgeIndex}_v${value.variant}`);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.edges.setKO(value, n);
        this.svg.append(this.edges.getKO(value));
    }

    addCorner(value)
    {
        if(value.edge === "None")
        {
            this.handleNone(this.corners, value);
            return;
        }

        if(!this.corners)
            this.corners = new KOMap();

        if(this.corners.partialHas(value))
            return;

        let matches = this.corners.partialGetAll({edge: value.edge, edgeIndex: value.edgeIndex}, 1);
        matches.forEach(m => 
        {
            this.svg.removeChild(m[1]);
            this.corners.delete(m[0]);
        });        

        let n = SVG.createUse(`${value.edge}_e${value.edgeIndex}_c${value.cornerType}_v${value.variant}`);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.corners.setKO(value, n);
        this.svg.append(this.corners.getKO(value));
    }

    addConnector(value) // {edge (none, rail), index, variant}
    {
        if(value.edge === "None")
        {
            this.handleNone(this.connectors, value);
            return;
        }

        if(!this.connectors)
            this.connectors = new KOMap();

        if(this.connectors.partialHas(value))
            return;

        let n = SVG.createUse(`${value.edge}_e${value.edgeIndex}_v${value.variant}`);
        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

        this.connectors.setKO(value, n);
        this.svg.append(this.connectors.getKO(value));
    }

    // separate borders from metadata - have the editor do all the calculations for borders
    addMetadata(value)
    {  
        if(!this.metadata)
            this.metadata = new KOMap();

        let offset = this.hexMap.offsetOn ? (this.col % 2 ? -1 : 0) : (this.col % 2 ? 0 : -1);
        let adj = 
        [
            this.hexMap.getHexFromId(`${this.col},${this.row - 1}`),
            this.hexMap.getHexFromId(`${this.col + 1},${this.row + offset}`),
            this.hexMap.getHexFromId(`${this.col + 1},${this.row + offset + 1}`),
            this.hexMap.getHexFromId(`${this.col},${this.row + 1}`),
            this.hexMap.getHexFromId(`${this.col - 1},${this.row + offset + 1}`),
            this.hexMap.getHexFromId(`${this.col - 1},${this.row + offset}`)
        ];

        for(const [k, v] of value)
        {
            if(this.metadata.get(k) === v) // if no change in property value skip to next incoming property
                continue;

            this.metadata.set(k, v);

            let md = this.hexMap.metadata.get(k);

            if(md.renderRules[0].type === "border") // at this point you know that a property value has changed
            {
                if(!this.borders)
                    this.borders = new KOMap();

                for(let side = 0; side < 6; side++)
                {
                    let borderId = `${md.renderRules[0].symbol}_${side}`;

                    if(v === adj[side]?.metadata?.get(k)) // an adjacent hex has the same property value
                    {
                        let id = `${md.renderRules[0].symbol}_${(side + 3) % 6}`; // look for side opposite this side
                        let d = adj[side].borders.get(id);

                        if(d)
                        {
                            adj[side].svg.removeChild(d);
                            adj[side].borders.delete(id);
                        }
                    }
                    else
                    {
                        let n = SVG.createUse(borderId);
                        n.setAttribute("x", this.hexTerrain.x.baseVal.value);
                        n.setAttribute("y", this.hexTerrain.y.baseVal.value);
                        n.setAttribute("width", this.hexTerrain.width.baseVal.value);
                        n.setAttribute("height", this.hexTerrain.height.baseVal.value);

                        this.svg.append(n);
                        this.borders.set(borderId, n);
                    }
                } // for sides
            }
            else
                throw new Error(`Unknown rendering rule ${md.renderRules[0].type} for metadata.`);
        } // for passed meta
    }

    handleNone(map, value)
    {
        if(!map)
            return;

        let matches = map.partialGetAll({edgeIndex: value.edgeIndex}, 1);

        matches.forEach(v => 
        {
            this.svg.removeChild(v[1]);
            map.delete(v[0]);
        });
        
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