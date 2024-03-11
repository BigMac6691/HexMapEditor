class HexMap
{
    constructor()
    {
        this.svg = SVG.create("svg", {viewBox: "0 0 1000 866", preserveAspectRatio: "none", style: "background-color:blue"});
        this.defs = SVG.create("defs");
        this.map = SVG.create("g");
        this.svg.append(this.defs, this.map);

        this.offsetOn = 0;
        this.borderColour = "#000000";
        this.defaultHexFill = "#ffffff";

        this.svg.addEventListener("mousemove", evt => this.mouseMove(evt));
        this.svg.addEventListener("click", evt => this.mouseClick(evt));

        this.fade = SVG.create("linearGradient", {id: "topLeftFade", x1: "0", y1: "0", x2: "0", y2: 1});
        this.fade.append(SVG.create("stop", {offset: "0%", "stop-color": "#ff0000"}));
        this.fade.append(SVG.create("stop", {offset: "10%", "stop-color": "#ff0000", "stop-opacity": "0.5"}));
        this.fade.append(SVG.create("stop", {offset: "20%", "stop-color": "#ff0000", "stop-opacity": "0.2"}));
        this.fade.append(SVG.create("stop", {offset: "100%", "stop-color": "#ff0000", "stop-opacity": "0"}));

        this.defs.append(this.fade);

        this.hexagonSymbol = SVG.create("symbol", {id: "hexagon", viewBox: "0 0 1000 866", preserveAspectRatio: "none"});
        this.hexagonSymbol.append(SVG.create("polygon", {points: "250,0 750,0 1000,433 750,866 250,866 0,433"}));
        this.svg.append(this.hexagonSymbol);

        this.TAN30 = Math.tan(30 * Math.PI / 180); console.log(`TAN30=${this.TAN30}`);
        
        this.symbols = [];

        this.makeSymbol("riverTT_1", "M 365.5 0 L 634.5 0 L 692.3 100 L 307.7 100 Z");
        this.makeSymbol("riverTR_1", "M 692.3 100 L 807.7 100 L 942 333 L 884.5 433 Z");
        this.makeSymbol("riverBR_1", "M 884.5 433 L 942 533 L 807.7 766 L 692.3 766 Z");
        this.makeSymbol("riverBB_1", "M 692.3 766 L 634.5 866 L 365.5 866 L 307.7 766 Z");
        this.makeSymbol("riverBL_1", "M 307.7 766 L 192.3 766 L 57.7 533 L 115.5 433 Z");
        this.makeSymbol("riverTL_1", "M 115.5 433 L 57.7 333 L 192.3 100 L 307.7 100 Z");

        this.hexes = [[new Hex(this, 0, 0)]];
        this.cursor = new DOMPoint(0, 0);
        this.cursorHex = SVG.createUse("hexagon", {id: "cursor", stroke: "#ff0000", fill: "none", style: "animation: cursor 3s infinite;"});
        this.map.append(this.cursorHex);
    }

    mouseMove(evt)
    {
        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.svg.getScreenCTM().inverse());
    }

    mouseClick(evt)
    {
        let coords = evt.srcElement.id.split(",");
        this.cursor.x = coords[0];
        this.cursor.y = coords[1];

        this.drawCursor();
    }

    drawCursor()
    {
        let vb = this.svg.getAttribute("viewBox").split(/\s+|,/);
        let w = +vb[2] / (3 * this.hexes.length + 1);
        let h = +vb[3] / (this.hexes[0].length + (this.hexes.length > 1 ? 0.5 : 0));
        let width = 4 * w;
        let offset = this.hexes.length > 1 ? (this.cursor.x % 2 === this.offsetOn ? 0 : h / 2) : 0;
        
        this.map.removeChild(this.cursorHex);

        this.cursorHex.setAttribute("x", 3 * w * this.cursor.x);
        this.cursorHex.setAttribute("y", h * this.cursor.y + offset);
        this.cursorHex.setAttribute("width", width);
        this.cursorHex.setAttribute("height", h);

        this.map.append(this.cursorHex);

        console.log(this.cursor);
    }

    makeSymbol(id, d)
    {
        let s = SVG.create("symbol", {id: id, viewBox: "0 0 1000 866", preserveAspectRatio: "none"});
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
        let h = +vb[3] / (this.hexes[0].length + (this.hexes.length > 1 ? 0.5 : 0));
        let width = 4 * w;

        console.log(`drawPolygons w=${w}, h=${h}`);

        for(let col = 0; col < this.hexes.length; col++)
        {
            let x = 3 * w * col;
            let offset = this.hexes.length > 1 ? (col % 2 === this.offsetOn ? 0 : h / 2) : 0;

            for(let row = 0; row < this.hexes[col].length; row++)
            {
                let y = h * row + offset;

                // this.map.append(SVG.createUse("hexagon", {x: 3 * w * col, y: 2 * h * row + offset, fill: "url(#topLeftFade)"}));
                this.map.append(SVG.createUse("hexagon", {id: `${col},${row}`, x: x, y: y, width: width, height: h, fill: "#ffffff"}));

                this.symbols.forEach(s => this.map.append(SVG.createUse(s.id, {x: x, y: y, width: width, height: h, fill: "none", stroke: "#ff0000"})));
            }
        }
    }

    initMap()
    {
        this.clearMap();
    }

    drawMap()
    {
        // this.clearMap();

        let vb = this.svg.getAttribute("viewBox").split(/\s+|,/);
        let w = +vb[2] / (3 * this.hexes.length + 1);
        let h = +vb[3] / (this.hexes[0].length + (this.hexes.length > 1 ? 0.5 : 0));
        let width = 4 * w;

        console.log(`drawMap w=${w}, h=${h}`);

        for(let col = 0; col < this.hexes.length; col++)
        {
            let x = 3 * w * col;
            let offset = this.hexes.length > 1 ? (col % 2 === this.offsetOn ? 0 : h / 2) : 0;

            for(let row = 0; row < this.hexes[col].length; row++)
            {
                let y = h * row + offset;

                this.hexes[col][row].drawHex(x, y, width, h)
            }
        }

        this.drawCursor();
    }
}