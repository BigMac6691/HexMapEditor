class SVGEditorControl extends SidePanel
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;

        this.menu = new Menu("flex");
        this.content.append(this.menu.div);
        ["defs", "Terrain", "Edges", "Corners", "Connectors", "Meta"]
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
                    this.terrainEditor = new TerrainEditor(this.hexMap);
                    n = this.terrainEditor.uiDiv;
                    break;

                case "Edges":
                    this.edgeEditor = new EdgeEditor(this.hexMap);
                    n = this.edgeEditor.uiDiv;
                    break;

                case "Corners":
                    this.cornerEditor = new CornerEditor(this.hexMap);
                    n = this.cornerEditor.uiDiv;
                    break;

                case "Connectors":
                    this.connectorEditor = new ConnectorEditor(this.hexMap);
                    n = this.connectorEditor.uiDiv;
                    break;

                // case "Meta":
                //     break;

                default:
                    n = HTML.create("div", {innerHTML: `DIV:${m}`});
            }

            this.content.append(n);
			this.menu.addItem(m, n);
        });
    }
}