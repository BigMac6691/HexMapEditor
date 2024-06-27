class SVGControl extends ControlUI
{
    constructor(title, data)
    {
        super(title);

        this.display = "flex";
        this.content.classList.add("featureCol");
        this.boundChange = this.handleChange.bind(this);

        let vbDiv = HTML.create("div");
        this.viewBoxWidth = HTML.create("input", {type: "number", name: "viewBoxWidth", value: data.viewBoxWidth}, null, {change: this.boundChange});
        vbDiv.append(HTML.createLabel("View Box Width: ", this.viewBoxWidth));

        this.viewBoxHeight = HTML.create("input", {type: "number", name: "viewBoxHeight", value: data.viewBoxHeight}, null, {change: this.boundChange});
        vbDiv.append(HTML.createLabel(" Height: ", this.viewBoxHeight));
        this.content.append(vbDiv);

        let svgDiv = HTML.create("div");
        this.mapWidth = HTML.create("input", {type: "number", name: "mapWidth", value: data.mapWidth}, null, {change: this.boundChange});
        svgDiv.append(HTML.createLabel("SVG Width: ", this.mapWidth, "px"));

        this.mapHeight = HTML.create("input", {type: "number", name: "mapHeight", value: data.mapHeight}, null, {change: this.boundChange});
        svgDiv.append(HTML.createLabel(" Height: ", this.mapHeight, "px"));
        this.content.append(svgDiv);

        this.backgroundColour = HTML.create("input", {type: "color", name: "backgroundColour", value: data.backgroundColour}, null, {change: this.boundChange});
        this.content.append(HTML.createLabel("Background: ", this.backgroundColour));
    }

    handleChange(evt)
    {
        let msg = 
        {
            name: evt.target.name,
            value: evt.target.value
        };

        this.dispatchEvent(new CustomEvent("svgAttribute", {detail: msg}));
    }

    handleMapLoad(evt)
    {
        // [
        //     "viewBoxWidth", 
        //     "viewBoxHeight", 
        //     "mapWidth", 
        //     "mapHeight",
        //     "backgroundColour"
        // ].forEach(field => this[field].value = evt.detail[field]);

        this.viewBoxWidth.value = evt.detail.vbWidth;
        this.viewBoxHeight.value = evt.detail.vbHeight;
        this.mapWidth.value = evt.detail.width;
        this.mapHeight.value = evt.detail.height;
        this.backgroundColour.value = evt.detail.background;
    }
}