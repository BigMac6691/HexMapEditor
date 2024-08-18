class ModelControl extends SidePanel
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;
        this.display = "flex";
        this.content.classList.add("featureCol");
        this.boundChange = this.handleChange.bind(this);

        let tempDiv = HTML.create("div");
        this.cols = HTML.create("input", {type: "number", name: "cols", value: this.editor.hexMap.hexes.length, min: 1}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel("Map Columns: ", this.cols));

        this.rows = HTML.create("input", {type: "number", name: "rows", value: this.editor.hexMap.hexes[0].length, min: 1}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel(" Rows: ", this.rows));
        this.content.append(tempDiv);

        tempDiv = HTML.create("div");
        this.jumpColour = HTML.create("input", {type: "color", name: "jumpColour", value: this.editor.hexMap.jumpColour}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel("Jump colour: ", this.jumpColour));

        this.jumpWidth = HTML.create("input", {type: "number", name: "jumpWidth", value: this.editor.hexMap.jumpWidth, min: 1}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel(" Width: ", this.jumpWidth));
        this.content.append(tempDiv);

        tempDiv = HTML.create("div");
        this.borderColour = HTML.create("input", {type: "color", name: "borderColour", value: this.editor.hexMap.borderColour}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel("Border: ", this.borderColour));

        this.defaultTerrainColour = HTML.create("input", {type: "color", name: "defaultTerrainColour", value: this.editor.hexMap.defaultHexFill}, null, {change: this.boundChange});
        tempDiv.append(HTML.createLabel(" Hex: ", this.defaultTerrainColour));

        this.textColour = HTML.create("input", {type: "color", name: "textColour", value: this.editor.hexMap.textColor}, null, {change: this.boundChange});
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
        console.log(`${evt.target.name}=${evt.target.value}`);
        let modelChange = false;
        let hexes = this.editor.hexMap.hexes;

        switch(evt.target.name)
        {
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

            case "jumpColour":
                this.editor.hexMap.jumpColour = this.jumpColour.value;
                break;

            case "jumpWidth":
                this.editor.hexMap.jumpWidth = +this.jumpWidth.value;
                break;

            case "borderColour":
                this.editor.hexMap.borderColour = this.borderColour.value;
                break;

            case "defaultTerrainColour":
                this.editor.hexMap.defaultHexFill = this.defaultTerrainColour.value;
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
                console.log(`Unknown Model attribute ${evt.target.name}`);
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
            this.editor.hexMap.drawMap();
    }

    handleMapLoad(evt)
    {
        this.cols.value = evt.detail.hexes.length;
        this.rows.value = evt.detail.hexes[0].length;
        this.jumpColour.value = evt.detail.jumpColour;
        this.jumpWidth.value = evt.detail.jumpWidth;
        this.borderColour.value = evt.detail.borderColour;
        this.defaultTerrainColour = evt.detail.defaultHexFill;
        this.textColour.value = evt.detail.textColour;
        this.offsetOn.value = evt.detail.offsetOn === 1;
        this.displayCursor.value = evt.detail.displayCursor;
    }
}