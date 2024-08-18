class HexMapEditor
{
    constructor() 
    {
        this.hexMap = new HexMap();

        this.initMap();
        this.makeUI();
    }

    initMap()
    {
        this.hexMap.initMap();
    }

    makeUI()
    {
        let mp = document.getElementById("mapPanel");
        mp.append(this.hexMap.svg); 

        // File panel
        this.fileControl = new FileEditor("File", this);
        let div0 = this.fileControl.div;

        this.globalPanel = new GlobalAttributePanel("Global Attribute Editor", this);
        this.fileControl.addEventListener("mapLoad", this.globalPanel.handleMapLoad.bind(this.globalPanel));
        let div1 = this.globalPanel.div;

        // SVG attributes
        // this.svgControl = new SVGEditor("SVG Attributes", this);
        // this.fileControl.addEventListener("mapLoad", this.svgControl.handleMapLoad.bind(this.svgControl));
        // let div1 = this.svgControl.div;

        // Model atributes
        // this.modelControl = new ModelControl("Model Attributes", this);
        // this.fileControl.addEventListener("mapLoad", this.modelControl.handleMapLoad.bind(this.modelControl));
        // let div2 = this.modelControl.div;

        // Hex attributes
        this.mapEditor = new MapEditor("Map Content Editor", this);
        this.fileControl.addEventListener("mapLoad", this.mapEditor.handleMapLoad.bind(this.mapEditor));
        let div3 = this.mapEditor.div;

        // Feature editor 
        this.SVGEditor = new SVGEditorControl("SVG Editors", this);
        let div4 = this.SVGEditor.div; 
        
        let div5 = HTML.create("div", null, ["controlDiv"]);
        div5.append(HTML.create("h3", {textContent: "Hex Editor"}));

        document.getElementById("controlPanel").append(div0, div1, div3, div4, div5);
    }
}