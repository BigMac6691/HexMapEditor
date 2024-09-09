class GlobalAttributePanel extends SidePanel
{
    constructor(title, editor)
    {
        super(title);

        let mapPanel = document.getElementById("mapPanel");

        this.editor = editor;
        this.display = "flex";
        this.content.classList.add("featureCol");
        this.boundChange = this.handleChange.bind(this);

        // =============== SVG attributes ===============
        let vbDiv = HTML.create("div");
        this.viewBoxWidth = HTML.create("input", {type: "number", name: "viewBoxWidth", value: 1000}, null, {change: this.boundChange});
        vbDiv.append(HTML.createLabel("View Box Width: ", this.viewBoxWidth));

        this.viewBoxHeight = HTML.create("input", {type: "number", name: "viewBoxHeight", value: 866}, null, {change: this.boundChange});
        vbDiv.append(HTML.createLabel(" Height: ", this.viewBoxHeight));
        this.content.append(vbDiv);

        let svgDiv = HTML.create("div");
        this.mapWidth = HTML.create("input", {type: "number", name: "mapWidth", value: mapPanel ? mapPanel.scrollWidth : 0}, null, {change: this.boundChange});
        svgDiv.append(HTML.createLabel("SVG Width: ", this.mapWidth, "px"));

        this.mapHeight = HTML.create("input", {type: "number", name: "mapHeight", value: mapPanel ? mapPanel.scrollHeight : 0}, null, {change: this.boundChange});
        svgDiv.append(HTML.createLabel(" Height: ", this.mapHeight, "px"));
        this.content.append(svgDiv);

        // =============== Model attributes ===============
        let tempDiv = HTML.create("div");
        this.cols = HTML.create("input", {type: "number", name: "cols", value: this.editor.hexMap.hexes.length, min: 1}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel("Map Columns: ", this.cols));

        this.rows = HTML.create("input", {type: "number", name: "rows", value: this.editor.hexMap.hexes[0].length, min: 1}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel(" Rows: ", this.rows));
        this.content.append(tempDiv);

        tempDiv = HTML.create("div");
        this.vpMin = HTML.create("input", {type: "number", name: "vpMin", value: this.editor.hexMap.vpMin, min: 1}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel("Viewport Minimum: ", this.vpMin));

        this.vpMax = HTML.create("input", {type: "number", name: "vpMax", value: this.editor.hexMap.vpMax, min: 1}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel(" Maximum: ", this.vpMax));
        this.content.append(tempDiv);

        tempDiv = HTML.create("div");
        this.backgroundColour = HTML.create("input", {type: "color", name: "backgroundColour", value: "#0000ff"}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel("Background: ", this.backgroundColour));

        this.borderColour = HTML.create("input", {type: "color", name: "borderColour", value: this.editor.hexMap.borderColour}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel(" Border: ", this.borderColour));

        this.defaultHexFill = HTML.create("input", {type: "color", name: "defaultTerrainColour", value: this.editor.hexMap.defaultHexFill}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel(" Hex: ", this.defaultHexFill));

        this.textColour = HTML.create("input", {type: "color", name: "textColour", value: this.editor.hexMap.textColour}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel(" Text: ", this.textColour));
        this.content.append(tempDiv);

        tempDiv = HTML.create("div");
        this.offsetOn = HTML.create("input", {type: "checkbox", name: "offsetOn", checked: this.editor.hexMap.offsetOn}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel("Hex offset: ", this.offsetOn));

        this.displayCursor = HTML.create("input", {type: "checkbox", name: "displayCursor", checked: this.editor.hexMap.displayCursor}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel("Display cursor: ", this.displayCursor));
        this.content.append(tempDiv);
    }

    handleChange(evt)
    {
        let modelChange = false;
        let hexes = this.editor.hexMap.hexes;

        switch(evt.target.name)
        {
            // =============== SVG attributes ===============
            case "viewBoxWidth":
                this.editor.hexMap.viewBoxWidth = evt.target.value;
                this.editor.hexMap.svg.setAttribute("viewBox", `0 0 ${this.viewBoxWidth.value} ${this.viewBoxHeight.value}`);
                break;

            case "viewBoxHeight":
                this.editor.hexMap.viewBoxHeight = evt.target.value;
                this.editor.hexMap.svg.setAttribute("viewBox", `0 0 ${this.viewBoxWidth.value} ${this.viewBoxHeight.value}`);
                break;

            case "mapWidth":
                this.editor.hexMap.mapWidth = evt.target.value;
                this.editor.hexMap.svg.setAttribute("width", evt.target.value);
                break;

            case "mapHeight":
                this.editor.hexMap.mapHeight = evt.target.value;
                this.editor.hexMap.svg.setAttribute("height", evt.target.value);
                break;

            case "backgroundColour":
                this.editor.hexMap.backgroundColour = evt.target.value;
                this.editor.hexMap.svg.style.background = evt.target.value;
                break;

            // =============== Model attributes ===============
            case "cols":
                if(+evt.target.value < hexes.length)
                    hexes.length = +evt.target.value;
                else if(+evt.target.value > hexes.length)
                {
                    while(hexes.length < +evt.target.value)
                        hexes.push(Array.from({length: hexes[0].length}, (_, n) => new Hex(this.editor.hexMap, hexes.length, n)));
                }

                modelChange = true;
                break;
            
            case "rows":
                if(+evt.target.value < hexes[0].length)
                    hexes.forEach(row => row.length = +evt.target.value);
                else if(+evt.target.value > hexes[0].length)
                {
                    let n = +evt.target.value - hexes[0].length;

                    for(let ci = 0; ci < hexes.length; ci++)
                        for(let ri = 0; ri < n; ri++)
                            hexes[ci].push(new Hex(this.editor.hexMap, ci, hexes[ci].length))
                }

                modelChange = true;
                break;

            case "vpMin":
                this.editor.hexMap.vpMin = this.vpMin.value;
                break;

            case "vpMax":
                this.editor.hexMap.vpMax = this.vpMax.value;
                break;

            case "borderColour":
                this.editor.hexMap.borderColour = this.borderColour.value;
                break;

            case "defaultHexFill":
                this.editor.hexMap.defaultHexFill = this.defaultHexFill.value;
                break;

            case "textColour":
                this.editor.hexMap.textColour = this.textColour.value;
                break;

            case "offsetOn":
                this.editor.hexMap.offsetOn = (this.offsetOn.checked ? 1 : 0);
                modelChange = true;
                break;

            case "displayCursor":
                this.editor.hexMap.displayCursor = this.displayCursor.checked;
                break;

            default:
                console.log(`Unknown Global attribute ${evt.target.name}`);
        }

        if(modelChange)
        {
            let mapPanel = document.getElementById("mapPanel");
            mapPanel.style.fontSize = `${100 / (hexes[0].length + (hexes.length > 1 ? 0.5 : 0))}px`;

            this.editor.hexMap.cursor.x = Math.min(hexes.length - 1, this.editor.hexMap.cursor.x);
            this.editor.hexMap.cursor.y = Math.min(hexes[0].length - 1, this.editor.hexMap.cursor.y);

            this.editor.hexMap.initMap();
        }
        else
            this.editor.hexMap.initMap();//.drawMap(); commenting out for now
    }

    handleMapLoad(evt)
    {
        console.log("GobalAttributePanel.handleMapLoad()...");

        [
            "viewBoxWidth", 
            "viewBoxHeight", 
            "mapWidth", 
            "mapHeight",
            "vpMin",
            "vpMax",
            "backgroundColour",
            "borderColour",
            "defaultHexFill",
            "textColour",
            "displayCursor"
        ].forEach(field => this[field].value = evt.detail[field] ?? this.editor.hexMap[field]);

        this.cols.value = evt.detail.hexes.length;
        this.rows.value = evt.detail.hexes[0].length;
        this.offsetOn.value = evt.detail.offsetOn === 1;
    }
}