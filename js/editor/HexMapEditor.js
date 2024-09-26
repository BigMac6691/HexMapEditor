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

        // Gloabl attributes panel
        this.globalPanel = new GlobalAttributePanel("Global Attribute Editor", this);
        this.fileControl.addEventListener("mapLoad", this.globalPanel.handleMapLoad.bind(this.globalPanel));
        let div1 = this.globalPanel.div;

        // Map content editor panel
        this.mapEditor = new MapEditor("Map Content Editor", this);
        this.fileControl.addEventListener("mapLoad", this.mapEditor.handleMapLoad.bind(this.mapEditor));
        let div3 = this.mapEditor.div;

        // SVG editor panel
        this.svgEditorControl = new SVGEditorControl("SVG Editors", this);
        this.svgEditorControl.addEventListener("change", this.mapEditor.handleChange.bind(this.mapEditor));
        let div4 = this.svgEditorControl.div; 
        
        // Individual hex editor - for tweaking details
        this.hexEditor = new HexEditor("Hex Editor", this);
        let div5 = this.hexEditor.div;
        
        document.getElementById("controlPanel").append(div0, div1, div3, div4, div5);
    }
}