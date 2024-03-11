class HexMapEditor
{
    constructor() 
    {
        this.boundSVGChange = this.handleSVGChange.bind(this);
        this.boundMapModelChange = this.handleMapModelChange.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseClick = this.handleMouseClick.bind(this);

        this.hexMap = new HexMap();
        this.hexMap.svg.addEventListener("mousemove", this.boundMouseMove);
        this.hexMap.svg.addEventListener("click", this.boundMouseClick);

        this.makeUI();
        this.hexMap.drawMap();
        // this.hexMap.drawPolygons();
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

        this.mouseMove = HTML.create("p", {innerHTML: "Mouse location x, y"});
        this.mouseClick = HTML.create("p", {innerHTML: "Click location: x, y"});
        div3.append(this.mouseMove, this.mouseClick);

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
        let modelShrink = c < model.length || r < model[0].length;

        // Handle column changes
        if(c < model.length)
            model.length = c;
        else if(c > model.length)
        {
            while(model.length < c)
                model.push(Array.from({length: model[0].length}, (_, n) => new Hex(this.hexMap, model.length, n)));
        }

        // Handle row changes
        if(r < model[0].length)
            model.forEach(row => row.length = r);
        else if(r > model[0].length)
        {
            let n = r - model[0].length;

            for(let ci = 0; ci < model.length; ci++)
                for(let ri = 0; ri < n; ri++)
                    model[ci].push(new Hex(this.hexMap, ci, model[ci].length))
        }

        // if(polygonChange)
        //     this.he

        this.hexMap.borderColour = this.borderColour.value;
        this.hexMap.defaultHexFill = this.defaultTerrainColour.value;

        this.hexMap.drawMap();
        // this.hexMap.drawPolygons();
    }

    handleMouseMove(evt)
    {
        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.hexMap.svg.getScreenCTM().inverse());
        this.mouseMove.innerHTML = `Mouse location: ${pt.x}, ${pt.y}`;
    }

    handleMouseClick(evt)
    {
        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.hexMap.svg.getScreenCTM().inverse());
        this.mouseClick.innerHTML = `Click location: ${pt.x}, ${pt.y} with id ${evt.srcElement.id}`;
    }

    // recalculatePolygon()
    // {
    //     let vb = this.hexMap.getSVG().getAttribute("viewBox").split(/\s+|,/);
    //     let w = this.truncate(+vb[2] / (3 * this.hexMap.hexes.length + 1), Math.pow(10, vb[2].length));
    //     let h = this.truncate(+vb[3] / (2 * this.hexMap.hexes[0].length + (this.hexMap.hexes.length > 1 ? 1 : 0)), Math.pow(10, vb[3].length));
    //     let points = `${w},${0} ${3 * w},${0} ${4 * w},${h} ${3 * w},${2 * h} ${w},${2 * h} ${0},${h}`;

    //     this.hexMap.hexagon.setAttribute("points", points);

    //     this.hexMap.drawPolygons();
    // }

    truncate(n, d)
    {
        return Math.trunc(n * d) / d;
    }
}