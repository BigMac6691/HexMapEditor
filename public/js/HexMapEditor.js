class HexMapEditor
{
    constructor() 
    {
        this.boundSVGChange = this.handleSVGChange.bind(this);
        this.boundMapModelChange = this.handleMapModelChange.bind(this);

        this.hexMap = new HexMap();

        this.makeUI();
        this.hexMap.drawMap();
        this.hexMap.drawPolygons();
    }

    makeUI()
    {
        let mp = document.getElementById("mapPanel");
        mp.append(this.hexMap.getSVG());

        // SVG attributes
        let div1 = HTML.create("div", null, ["controlDiv"]);
        div1.append(HTML.create("h3", {textContent: "SVG Attributes"}));

        this.viewBoxWidth = HTML.create("input", {type: "number", value: "1000"}, null, {change: this.boundSVGChange});
        div1.append(HTML.createLabel("View Box Width: ", this.viewBoxWidth));

        this.viewBoxHeight = HTML.create("input", {type: "number", value: "866"}, null, {change: this.boundSVGChange});
        div1.append(HTML.createLabel("View Box Height: ", this.viewBoxHeight));

        this.mapWidth = HTML.create("input", {type: "number", name: "width", value: mp.scrollWidth}, null, {change: this.boundSVGChange});
        div1.append(HTML.createLabel("Width: ", this.mapWidth, "px"));

        this.mapHeight = HTML.create("input", {type: "number", name: "height", value: mp.scrollHeight}, null, {change: this.boundSVGChange});
        div1.append(HTML.createLabel("Height: ", this.mapHeight, "px"));

        this.backgroundColour = HTML.create("input", {type: "color", value: "#0000ff"}, null, {change: this.boundSVGChange});
        div1.append(HTML.createLabel("Background colour: ", this.backgroundColour));

        // Model atributes
        let div2 = HTML.create("div", null, ["controlDiv"]);
        div2.append(HTML.create("h3", {textContent: "Model Attributes"}));

        this.rows = HTML.create("input", {type: "number", value: 1, min: 1}, null, {change: this.boundMapModelChange});
        div2.append(HTML.createLabel("Rows: ", this.rows));

        this.cols = HTML.create("input", {type: "number", value: 1, min: 1}, null, {change: this.boundMapModelChange});
        div2.append(HTML.createLabel("Columns: ", this.cols));

        this.borderColour = HTML.create("input", {type: "color", value: "#000000"}, null, {change: this.boundMapModelChange});
        div2.append(HTML.createLabel("Border Colour: ", this.borderColour));

        this.defaultTerrainColour = HTML.create("input", {type: "color", value: "#ffffff"}, null, {change: this.boundMapModelChange});
        div2.append(HTML.createLabel("Default Hex Colour: ", this.defaultTerrainColour));

        // Hex attributes
        let div3 = HTML.create("div", null, ["controlDiv"]);
        div3.append(HTML.create("h3", {textContent: "Hex Attributes"}));

        document.getElementById("controlPanel").append(div1, div2, div3);
    }

    handleSVGChange(evt)
    {
        if(evt.srcElement === this.viewBoxWidth || evt.srcElement === this.viewBoxHeight)
        {
            this.hexMap.getSVG().setAttribute("viewBox", `0 0 ${this.viewBoxWidth.value} ${this.viewBoxHeight.value}`);
            // this.recalculatePolygon();
        }
        else if(evt.srcElement === this.backgroundColour)
            this.hexMap.getSVG().style.background = evt.srcElement.value;
        else
            this.hexMap.getSVG().setAttribute(evt.srcElement.name, evt.srcElement.value);
    }

    handleMapModelChange(evt)
    {
        console.log("Map model change...");

        let c = +this.cols.value;
        let r = +this.rows.value;
        let model = this.hexMap.hexes;
        let polygonChange = c != model.length || r != model[0].length;

        // Handle column changes
        if(c < model.length)
            model.length = c;
        else if(c > model.length)
        {
            while(model.length < c)
                model.push(Array.from({length: model[0].length}, () => new Hex(this.hexMap)));
        }

        // Handle row changes
        if(r < model[0].length)
            model.forEach(row => row.length = r);
        else if(r > model[0].length)
        {
            let n = r - model[0].length;

            model.forEach(row => row.push(...Array.from({length: n}, () => new Hex(this.hexMap))));
        }

        // if(polygonChange)
        //     this.recalculatePolygon();

        // this.hexMap.hexagon.setAttribute("stroke", this.borderColour.value);
        // this.hexMap.hexagon.setAttribute("fill", this.defaultTerrainColour.value);

        // this.hexMap.drawMap();
        this.hexMap.drawPolygons();
    }

    recalculatePolygon()
    {
        let vb = this.hexMap.getSVG().getAttribute("viewBox").split(/\s+|,/);
        let w = this.truncate(+vb[2] / (3 * this.hexMap.hexes.length + 1), Math.pow(10, vb[2].length));
        let h = this.truncate(+vb[3] / (2 * this.hexMap.hexes[0].length + (this.hexMap.hexes.length > 1 ? 1 : 0)), Math.pow(10, vb[3].length));
        let points = `${w},${0} ${3 * w},${0} ${4 * w},${h} ${3 * w},${2 * h} ${w},${2 * h} ${0},${h}`;

        this.hexMap.hexagon.setAttribute("points", points);

        this.hexMap.drawPolygons();
    }

    truncate(n, d)
    {
        return Math.trunc(n * d) / d;
    }
}