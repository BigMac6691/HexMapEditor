class HexMapEditor
{
    constructor() 
    {
        this.boundSVGChange = this.handleSVGChange.bind(this);
        this.boundMapModelChange = this.handleMapModelChange.bind(this);

        this.hexMap = new HexMap();

        this.makeUI();
        this.hexMap.drawMap();
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

        this.viewBoxHeight = HTML.create("input", {type: "number", value: "1000"}, null, {change: this.boundSVGChange});
        div1.append(HTML.createLabel("View Box Height: ", this.viewBoxHeight));

        this.mapWidth = HTML.create("input", {type: "number", name: "width", value: mp.scrollWidth}, null, {change: this.boundSVGChange});
        div1.append(HTML.createLabel("Width: ", this.mapWidth, "px"));

        this.mapHeight = HTML.create("input", {type: "number", name: "height", value: mp.scrollHeight}, null, {change: this.boundSVGChange});
        div1.append(HTML.createLabel("Height: ", this.mapHeight, "px"));

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
            this.hexMap.getSVG().setAttribute("viewBox", `0 0 ${this.viewBoxWidth.value} ${this.viewBoxHeight.value}`);
        else
            this.hexMap.getSVG().setAttribute(evt.srcElement.name, evt.srcElement.value);

        this.hexMap.drawMap();
    }

    handleMapModelChange(evt)
    {
        let c = +this.cols.value;
        let r = +this.rows.value;
        let model = this.hexMap.getHexes();

        // Handle column changes
        if(c < model.length)
            model.length = c;
        else if(c > model.length)
        {
            while(model.length < c)
                model.push(Array.from({length: model[0].length}, () => new Hex(this.hexMap.getSVG())));
        }

        // Handle row changes
        if(r < model[0].length)
            model.forEach(row => row.length = r);
        else if(r > model[0].length)
        {
            let n = r - model[0].length;

            model.forEach(row => row.push(...Array.from({length: n}, () => new Hex(this.hexMap.getSVG()))));
        }

        this.hexMap.drawMap();
    }
}