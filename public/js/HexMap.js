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

        this.fade = SVG.create("linearGradient", {id: "topLeftFade", x1: "0", y1: "0", x2: "0", y2: 1});
        this.fade.append(SVG.create("stop", {offset: "0%", "stop-color": "#ff0000"}));
        this.fade.append(SVG.create("stop", {offset: "10%", "stop-color": "#ff0000", "stop-opacity": "0.5"}));
        this.fade.append(SVG.create("stop", {offset: "20%", "stop-color": "#ff0000", "stop-opacity": "0.2"}));
        this.fade.append(SVG.create("stop", {offset: "100%", "stop-color": "#ff0000", "stop-opacity": "0"}));

        // this.hexagon = SVG.create("polygon", {id: "hexagon", points: "250,0 750,0 1000,500 750,1000 250,1000 0,500", stroke:"#000000"});
        this.defs.append(this.fade);

        this.hexagonSymbol = SVG.create("symbol", {id: "hexagon", viewBox: "0 0 1000 1000", preserveAspectRatio: "none"});
        this.hexagonSymbol.append(SVG.create("polygon", {points: "250,0 750,0 1000,500 750,1000 250,1000 0,500", stroke:"#000000", "stroke-width": "2"}));
        this.svg.append(this.hexagonSymbol);

        this.TAN30 = Math.tan(30 * Math.PI / 180); console.log(`TAN30=${this.TAN30}`);
        
        this.symbols = [];

        this.makeSymbol("riverTT_1", "M 355 0 L 645 0 L 692.3 100 L 307.7 100 Z");// my geometry was wrong!
        this.makeSymbol("riverTR_1", "M 692.3 100 L 800 100 L 942 383 L 884.5 500 Z");
        this.makeSymbol("riverBR_1", "M 692.3 900 L 800 900 L 942 617 L 884.5 500 Z");
        this.makeSymbol("riverBB_1", "M 355 1000 L 645 1000 L 692.3 900 L 307.7 900 Z");
        this.makeSymbol("riverBL_1", "M 200 900 L 307.7 900 L 115.5 500 L 58 617 Z");
        this.makeSymbol("riverTL_1", "M 200 100 L 307.7 100 L 115.5 500 L 58 383 Z");
    }

    makeSymbol(id, d)
    {
        let s = SVG.create("symbol", {id: id, viewBox: "0 0 1000 1000", preserveAspectRatio: "none"});
        s.append(SVG.create("path", {d: d, "stroke-width": "5"}));

        this.symbols.push(s);
        
        this.svg.append(s);
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
        let h = +vb[3] / (this.hexes[0].length + (this.hexes.length > 1 ? 1 : 0));
        let xDelta = 0.2 * w * this.TAN30;
        let rWidth = 2 * w - 2 * xDelta;
        let width = 4 * w;

        console.log(`drawPolygons w=${w}, h=${h}, xDelta=${xDelta}, rWidth=${width}`);

        for(let col = 0; col < this.hexes.length; col++)
        {
            let x = 3 * w * col;
            let offset = this.hexes.length > 1 ? (col % 2 === this.offsetOn ? 0 : h / 2) : 0;

            for(let row = 0; row < this.hexes[col].length; row++)
            {
                let y = h * row + offset;

                // this.map.append(SVG.createUse("hexagon", {x: 3 * w * col, y: 2 * h * row + offset, fill: "url(#topLeftFade)"}));
                this.map.append(SVG.createUse("hexagon", {x: x, y: y, width: width, height: h, fill: "#ffffff"}));

                this.symbols.forEach(s => this.map.append(SVG.createUse(s.id, {x: x, y: y, width: width, height: h, fill: "none", stroke: "#ff0000"})));
            }
        }
    }

    // w is half the width of a side, h is half the height of a side, 2 * w = h
    // height of trapezoid is yDelta
    drawTrapezoid(w, h, col, row, offset)
    {
        let height = 2 * w / 10; // 10% of the side of the hexagon
        let x1 = 3 * w * col;
        let y1 = 2 * h * row + h + offset;

        let xDelta = height / 2;
        let yDelta = height * Math.sqrt(3) / 2;
        let midLen = 2 * w - 2 * height + xDelta;

        let ptsTop = `M ${x1 + w + height} ${y1 - h} ` + 
                     `L ${x1 + 3 * w - height} ${y1 - h} ` +
                     `L ${x1 + 3 * w - height + xDelta / 2} ${y1 - h + yDelta / 2} ` +
                     `l -50 10 ` +
                     `l -75 -15 ` +
                     `l -270 25 ` +
                     `L ${x1 + w + height - xDelta / 2} ${y1 - h + yDelta / 2} Z`;

        console.log(`w=${w}, h=${h}, col=${col}, row=${row}, offset=${offset}, xDelta=${xDelta}, yDelta=${yDelta}, midLen=${midLen}`);

        // let t1 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "url(#topLeftFade)", stroke: "red"});
        let t2 = SVG.create("polygon", {points: `${x1 + w + height},${y1 - h} ${x1 + 3 * w - height},${y1 - h} ${x1 + 3 * w + xDelta - height},${y1 - h + yDelta} ${x1 + w + height - xDelta},${y1 - h + yDelta}`, fill: "url(#topLeftFade)", stroke: "orange"});
        let t1 = SVG.create("polygon", {points: `${x1 + xDelta},${y1 - yDelta} ${x1 + w - xDelta},${y1 - h + yDelta} ${x1 + w + xDelta},${y1 - h + yDelta} ${x1 + height},${y1}`, fill: "url(#topLeftFade)", stroke: "blue"});

        let river = SVG.create("path", {d: ptsTop, fill: "#0000ff"});

        // let t1 = SVG.create("polygon", {points: `${x1},${y1} ${x1 + w},${y1 - h} ${x1 + w + xDelta},${y1 - h + yDelta} ${x1 + Math.sqrt(xDelta * xDelta + yDelta * yDelta)},${y1}`, fill: "url(#topLeftFade)", stroke: "blue"});
        
        // let t3 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "yellow", stroke: "red"});
        // let t4 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "purple", stroke: "red"});
        // let t5 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "orange", stroke: "red"});
        // let t6 = SVG.create("polygon", {points: `${x1},${y1} ${x2},${y2} ${x2 + xDelta},${y2 + yDelta} ${x1 + height},${y1}`, fill: "gray", stroke: "red"});
        this.map.append(t1, t2);//, river);//, t3, t4, t5, t6);
        // this.map.append(t2);//, t3, t4, t5, t6);
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