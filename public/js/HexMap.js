class HexMap
{
    constructor()
    {
        this.svg = SVG.create("svg", {viewBox: "0 0 1000 1000", preserveAspectRatio: "none", style: "background-color:blue"});
        this.hexes = [[new Hex(this)]];
        this.offsetOn = 0;

        this.defs = SVG.create("defs");
        this.map = SVG.create("g");
        this.svg.append(this.defs, this.map);

        this.hexagon = SVG.create("polygon", {id: "hexagon", points: "250,0 750,0 1000,500 750,1000 250,1000 0,500", fill: "#ffffff", stroke:"#000000"});
        this.defs.append(this.hexagon);
    }

    getMap()
    {
        return this.map;
    }

    getSVG()
    {
        return this.svg;
    }

    clearMap()
    {
        while(this.map.firstChild)
            this.map.removeChild(this.map.firstChild);
    }

    drawPolygons()
    {
        this.clearMap();

        let vb = this.svg.getAttribute("viewBox").split(/\s+|,/);
        let w = +vb[2] / (3 * this.hexes.length + 1);
        let h = +vb[3] / (2 * this.hexes[0].length + (this.hexes.length > 1 ? 1 : 0));

        for(let col = 0; col < this.hexes.length; col++)
        {
            let offset = this.hexes.length > 1 ? (col % 2 === this.offsetOn ? 0 : h) : 0;

            for(let row = 0; row < this.hexes[col].length; row++)
            {
                this.map.append(SVG.createUse("hexagon", {x: 3 * w * col, y: 2 * h * row + offset}));
                this.drawTrapezoid(w, h, col, row, offset);
            }
        }
    }

    drawTrapezoid(w, h, col, row, offset)
    {
        let height = 2 * w / 10; // 5% of the side of the hexagon
        let x1 = 3 * w * col;
        let y1 = 2 * h * row + h + offset;
        let x2 = x1 + w;
        let y2 = y1 - h;

        let xDelta = height / 2;
        let yDelta = height * Math.sqrt(3) / 2;

        let pts = `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`;

        let t1 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "red", stroke: "red"});
        let t2 = SVG.create("polygon", {points: `${x1 + w},${y1 - h} ${x1 + 3 * w},${y1 - h} ${x1 + 3 * w - xDelta},${y1 - h + yDelta} ${x1 + w + xDelta},${y1 - h + yDelta}`, fill: "green", stroke: "red"});
        // let t3 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "yellow", stroke: "red"});
        // let t4 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "purple", stroke: "red"});
        // let t5 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "orange", stroke: "red"});
        // let t6 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "gray", stroke: "red"});
        this.map.append(t1, t2);//, t3, t4, t5, t6);
    }

    drawMap()
    {
        if(this != null)
            return;

        this.clearMap();

        let vb = this.svg.getAttribute("viewBox").split(/\s+|,/);
        let w = +vb[2] / (3 * this.hexes.length + 1);
        let h = +vb[3] / (2 * this.hexes[0].length + (this.hexes.length > 1 ? 1 : 0));

        for(let col = 0; col < this.hexes.length; col++)
        {
            let offset = this.hexes.length > 1 ? (col % 2 === this.offsetOn ? 0 : h) : 0;

            for(let row = 0; row < this.hexes[col].length; row++)
                this.hexes[col][row].drawHex(w, h, col, row, offset);
        }
    }
}