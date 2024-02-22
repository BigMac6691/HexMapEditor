class HexMapEditor
{
    constructor() 
    {
        this.boundSVGChange = this.handleSVGChange.bind(this);
        this.boundMapModelChange = this.handleMapModelChange.bind(this);

        this.model = [[new Hex()]];

        this.makeUI();
        this.drawMap();
    }

    makeUI()
    {
        let mp = document.getElementById("mapPanel");

        this.map = SVG.create("svg", {viewBox: "0 0 100 100", preserveAspectRatio: "none"});
        mp.append(this.map);

        let cp = document.getElementById("controlPanel");
        
        this.viewBoxWidth = HTML.create("input", {type: "number", value: "100"}, null, {change: this.boundSVGChange});
        cp.append(HTML.createLabel("View Box Width: ", this.viewBoxWidth));

        this.viewBoxHeight = HTML.create("input", {type: "number", value: "100"}, null, {change: this.boundSVGChange});
        cp.append(HTML.createLabel("View Box Height: ", this.viewBoxHeight));

        this.mapWidth = HTML.create("input", {type: "number", name: "width", value: mp.scrollWidth}, null, {change: this.boundSVGChange});
        cp.append(HTML.createLabel("Map width: ", this.mapWidth, "px"));

        this.mapHeight = HTML.create("input", {type: "number", name: "height", value: mp.scrollHeight}, null, {change: this.boundSVGChange});
        cp.append(HTML.createLabel("Map height: ", this.mapHeight, "px"));

        this.rows = HTML.create("input", {type: "number", value: 1, min: 1}, null, {change: this.boundMapModelChange});
        cp.append(HTML.createLabel("Rows: ", this.rows));

        this.cols = HTML.create("input", {type: "number", value: 1, min: 1}, null, {change: this.boundMapModelChange});
        cp.append(HTML.createLabel("Columns: ", this.cols));
    }

    handleSVGChange(evt)
    {
        console.log(evt);

        if(evt.srcElement === this.viewBoxWidth || evt.srcElement === this.viewBoxHeight)
            this.map.setAttribute("viewBox", `0 0 ${this.viewBoxWidth.value} ${this.viewBoxHeight.value}`);
        else
            this.map.setAttribute(evt.srcElement.name, evt.srcElement.value);
    }

    handleMapModelChange(evt)
    {
        console.log(evt.srcElement.value);
    }

    drawMap()
    {
        console.log(this.model);

        let w = this.viewBoxWidth.value / this.cols.value;
        let wp = w / 4;
        let h = this.viewBoxHeight.value / this.rows.value;
        let hp = h / 2;

        console.log(`${w},${h}`);

        for(let row = 0; row < this.model.length; row++)
            for(let col = 0; col < this.model[row].length; col++)
            {
                console.log(this.model[row][col]);
                let x1 = w * col + wp;
                let y1 = h * row;
                let x2 = x1 + 2 * wp;
                let y2 = y1;
                this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

                x1 = x2;
                y1 = y2;
                x2 = x1 + wp;
                y2 = y1 + hp;
                this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

                x1 = x2;
                y1 = y2;
                x2 = x1 - wp;
                y2 = y1 + hp;
                this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

                x1 = x2;
                y1 = y2;
                x2 = x1 - 2 * wp;
                y2 = y1;
                this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

                x1 = x2;
                y1 = y2;
                x2 = x1 - wp;
                y2 = y1 - hp;
                this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

                x1 = x2;
                y1 = y2;
                x2 = x1 + wp;
                y2 = y1 - hp;
                this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));
            }
    }
}