class HexMapEditor
{
    constructor() 
    {
        this.boundSVGChange = this.handleSVGChange.bind(this);
        this.boundMapModelChange = this.handleMapModelChange.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseClick = this.handleMouseClick.bind(this);
        this.boundKeypress = this.handleKeypress.bind(this);

        this.painting = false;

        this.hexMap = new HexMap();
        this.hexMap.svg.addEventListener("mousemove", this.boundMouseMove);
        this.hexMap.svg.addEventListener("click", this.boundMouseClick);

        this.hexMap.svg.addEventListener("mouseenter", () => 
        {
            this.hexMap.svg.style.cursor = "crosshair";
            document.addEventListener("keydown", this.boundKeypress);
        });

        this.hexMap.svg.addEventListener("mouseleave", () => 
        {
            this.hexMap.svg.style.cursor = "default";
            document.removeEventListener("keydown", this.boundKeypress);
        });

        this.terrain = new Map();
        [
            {type: "clear", label: "Plains", fill: "#ffffff"},
            {type: "forest", label: "Forest", fill: "#00ff00"},
            {type: "hills", label: "Hills", fill: "#e06500"},
            {type: "mountains", label: "Mountain", fill: "#888888"},
            {type: "Desert", label: "Desert", fill: "#e9ec18"},
            {type: "Water", label: "Water", fill: "#0000ff"}
        ].forEach(t => this.terrain.set(t.type, t));

        this.makeUI();
        this.hexMap.initMap();

        // for testing purposes only make the map 15 X 15
        this.cols.value = 15;
        this.rows.value = 15;
        this.handleMapModelChange(null);
    }

    makeUI()
    {
        let mp = document.getElementById("mapPanel");
        mp.append(this.hexMap.getSVG());

        // SVG attributes
        let div1 = this.makeSVGUI(mp);        

        // Model atributes
        let div2 = this.makeModelUI();

        // Hex attributes
        let div3 = this.makeHexUI();

        document.getElementById("controlPanel").append(div1, div2, div3);
    }

    makeSVGUI(mp)
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "SVG Attributes"}));

        let vbDiv = HTML.create("div");
        this.viewBoxWidth = HTML.create("input", {type: "number", value: "1000"}, null, {change: this.boundSVGChange});
        vbDiv.append(HTML.createLabel("View Box Width: ", this.viewBoxWidth));

        this.viewBoxHeight = HTML.create("input", {type: "number", value: "866"}, null, {change: this.boundSVGChange});
        vbDiv.append(HTML.createLabel(" Height: ", this.viewBoxHeight));
        div.append(vbDiv);

        let svgDiv = HTML.create("div");
        this.mapWidth = HTML.create("input", {type: "number", name: "width", value: mp.scrollWidth}, null, {change: this.boundSVGChange});
        svgDiv.append(HTML.createLabel("SVG Width: ", this.mapWidth, "px"));

        this.mapHeight = HTML.create("input", {type: "number", name: "height", value: mp.scrollHeight}, null, {change: this.boundSVGChange});
        svgDiv.append(HTML.createLabel(" Height: ", this.mapHeight, "px"));
        div.append(svgDiv);

        this.backgroundColour = HTML.create("input", {type: "color", value: "#0000ff"}, null, {change: this.boundSVGChange});
        div.append(HTML.createLabel("Background colour: ", this.backgroundColour));

        return div;
    }

    makeModelUI()
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "Model Attributes"}));

        let crDiv = HTML.create("div");
        this.cols = HTML.create("input", {type: "number", value: 1, min: 1}, null, {change: this.boundMapModelChange});
        crDiv.append(HTML.createLabel("Map Columns: ", this.cols));

        this.rows = HTML.create("input", {type: "number", value: 1, min: 1}, null, {change: this.boundMapModelChange});
        crDiv.append(HTML.createLabel(" Rows: ", this.rows));
        div.append(crDiv);

        this.borderColour = HTML.create("input", {type: "color", value: "#000000"}, null, {change: this.boundMapModelChange});
        div.append(HTML.createLabel("Border Colour: ", this.borderColour));

        this.defaultTerrainColour = HTML.create("input", {type: "color", value: "#ffffff"}, null, {change: this.boundMapModelChange});
        div.append(HTML.createLabel("Default Hex Colour: ", this.defaultTerrainColour));

        return div;
    }

    makeHexUI()
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "Hex Attributes"}));

        this.mouseMove = HTML.create("p", {innerHTML: "Mouse location x, y"});
        this.mouseClick = HTML.create("p", {innerHTML: "Click location: x, y"});
        div.append(this.mouseMove, this.mouseClick);

        this.paintSelect = HTML.create("select");
        HTML.addOptions(this.paintSelect, [{text: "None", value: "none"}, {text: "Terrain", value: "terrain"}]);
        div.append(HTML.createLabel("Paint with: ", this.paintSelect));

        this.terrainSelect = HTML.createSelect(this.terrain);
        div.append(HTML.createLabel("Terrain: ", this.terrainSelect));

        return div;
    }

    handleKeypress(evt)
    {
        this.painting = !this.painting;

        if(this.painting)
            this.hexMap.svg.style.cursor = "cell";
        else
            this.hexMap.svg.style.cursor = "crosshair";
    }

    handleSVGChange(evt)
    {
        if(evt.target === this.viewBoxWidth || evt.target === this.viewBoxHeight)
        {
            this.hexMap.getSVG().setAttribute("viewBox", `0 0 ${this.viewBoxWidth.value} ${this.viewBoxHeight.value}`);
            // this.recalculatePolygon();
        }
        else if(evt.target === this.backgroundColour)
            this.hexMap.getSVG().style.background = evt.target.value;
        else
            this.hexMap.getSVG().setAttribute(evt.target.name, evt.target.value);
    }

    handleMapModelChange(evt)
    {
        console.log("Map model change...");

        this.hexMap.borderColour = this.borderColour.value;
        this.hexMap.defaultHexFill = this.defaultTerrainColour.value;

        let c = +this.cols.value;
        let r = +this.rows.value;
        let model = this.hexMap.hexes;
        let modelChange = c != model.length || r != model[0].length

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

        if(modelChange)
        {
            let mapPanel = document.getElementById("mapPanel");
            mapPanel.style.fontSize = `${100 / (this.hexMap.hexes[0].length + (this.hexMap.hexes.length > 1 ? 0.5 : 0))}px`;

            console.log(`Font size: ${mapPanel.style.fontSize}`);

            this.hexMap.cursor.x = Math.min(this.hexMap.hexes.length - 1, this.hexMap.cursor.x);
            this.hexMap.cursor.y = Math.min(this.hexMap.hexes[0].length - 1, this.hexMap.cursor.y);

            this.hexMap.initMap();
        }
        else
            this.hexMap.drawMap();
    }

    handleMouseMove(evt)
    {
        if(!evt.target.id.includes(","))
            return;

        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.hexMap.svg.getScreenCTM().inverse());

        this.mouseMove.innerHTML = `Mouse location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} in hex ${evt.target.id}`;

        if(this.painting)
        {
            let hex = this.hexMap.getHexFromId(evt.target.id);
            let terrain = this.terrainSelect.value;
            hex.terrain = this.terrain.get(terrain);
            // hex.drawHex(evt.target.x.baseVal.value, evt.target.y.baseVal.value, evt.target.width.baseVal.value, target.height.baseVal.value);
            hex.drawHex();
        }
    }

    handleMouseClick(evt)
    {
        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.hexMap.svg.getScreenCTM().inverse());
        this.mouseClick.innerHTML = `Click location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} with id ${evt.target.id}`;
    }
}