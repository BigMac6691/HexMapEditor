class SVGEditorControl extends SidePanel
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;

        this.menu = new Menu("flex");
        this.content.append(this.menu.div);
        ["defs", "Terrain", "Edges", "Corners", "Connectors", "Meta"] // may need to add borders?  Meta may get REALLY complex...
        .forEach(m =>
        {
            let n = null;

            switch(m)
            {
                case "defs":
                    this.defsEditor = new DefsEditor(this.editor.hexMap);
                    n = this.defsEditor.uiDiv;
                    break;

                case "Terrain":
                    this.terrainEditor = new TerrainEditor(this.editor.hexMap);
                    n = this.terrainEditor.uiDiv;
                    break;

                case "Edges":
                    this.edgeEditor = new EdgeEditor(this.editor.hexMap);
                    n = this.edgeEditor.uiDiv;
                    break;

                case "Corners":
                    this.cornerEditor = new CornerEditor(this.editor.hexMap);
                    n = this.cornerEditor.uiDiv;
                    break;

                case "Connectors":
                    this.connectorEditor = new ConnectorEditor(this.editor.hexMap);
                    n = this.connectorEditor.uiDiv;
                    break;

                case "Meta":
                    this.metaEditor = new MetaSVGEditor(this.editor.hexMap);
                    n = this.metaEditor.uiDiv;
                    break;

                default:
                    n = HTML.create("div", {innerHTML: `DIV:${m}`});
            }

            this.content.append(n);
			this.menu.addItem(m, n);
        });
    }

    handleMapLoad(evt)
    {
        console.log("SVG editor control called...");
        console.log(this.editor.hexMap);
        this.defsEditor.init(this.editor.hexMap.defs.querySelectorAll("pattern"));
        this.terrainEditor.init(this.editor.hexMap.terrain);
        this.edgeEditor.init(this.editor.hexMap.edges);
        this.cornerEditor.init(this.editor.hexMap.corners);
        this.connectorEditor.init(this.editor.hexMap.connectors);
    }
}