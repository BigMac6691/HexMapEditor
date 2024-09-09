class MetaEditor
{
    constructor(editor)
    {
        this.editor = editor;
        this.metadata = new Map();
        this.div = HTML.create("div", {style: "display:none"});
    }

    addMetadata(hex)
    {
        let mdList = new Map();
        for(const [k, v] of this.metadata)
            if(v.check.checked)
                mdList.set(k, v.value.value);

        if(mdList.size === 0)
            return;

        let offset = this.editor.hexMap.offsetOn ? (hex.col % 2 ? -1 : 0) : (hex.col % 2 ? 0 : -1);
        let adj = 
        [
            this.editor.hexMap.getHexFromId(`${hex.col},${hex.row - 1}`),
            this.editor.hexMap.getHexFromId(`${hex.col + 1},${hex.row + offset}`),
            this.editor.hexMap.getHexFromId(`${hex.col + 1},${hex.row + offset + 1}`),
            this.editor.hexMap.getHexFromId(`${hex.col},${hex.row + 1}`),
            this.editor.hexMap.getHexFromId(`${hex.col - 1},${hex.row + offset + 1}`),
            this.editor.hexMap.getHexFromId(`${hex.col - 1},${hex.row + offset}`)
        ];

        for(const [k, v] of mdList)
        {
            let valueChange = hex?.metadata?.get(k) !== v;

            if(!valueChange) // if no change in property value skip to next incoming property
                continue;

            hex.addMetadata({key: k, value: v});

            let md = this.editor.hexMap.metadata.get(k);

            if(md.renderType === "Border") // at this point you know that a property value has changed
            {
                if(valueChange) // if a value changes remove all borders for that value from selected hex only
                {
                    md.renderData.forEach(b => 
                    {
                        let border = hex?.borders?.get(b[0]);

                        if(border)
                        {
                            hex.svg.removeChild(border);
                            hex.borders.delete(b[0]);
                        }
                    });
                }

                for(let side = 0; side < 6; side++)
                {
                    let borderId = md.renderData[side][0];

                    if(v === adj[side]?.metadata?.get(k)) // an adjacent hex has the same property value
                    {
                        let oppId = md.renderData[(side + 3) % 6][0]; // look for side opposite this side
                        let oppBorder = adj[side].borders.get(oppId);

                        if(oppBorder)
                        {
                            adj[side].svg.removeChild(oppBorder);
                            adj[side].borders.delete(oppId);
                        }
                    }
                    else // do we add matching border on other side?
                        hex.addBorder({id: borderId});
                } // for sides
            }
            else
                throw new Error(`Unknown rendering rule ${md.renderRules[0].type} for metadata.`);
        } // for passed meta
    }

    handleMapLoad(evt)
    {
        console.log("MetaEditor.handleMapLoad()...");
        console.log(evt);
        this.metadata.clear();

        for(const[k, v] of evt.detail.metadata)
            this.createMetaUI(v);
    }

    handleChange(evt)
    {
        console.log(evt);
        this.createMetaUI(evt.detail.value);
    }

    createMetaUI(data)
    {
        let tempDiv = HTML.create("div", {style: "padding-bottom: 0.3em;"});
        let cb = HTML.create("input", {type: "checkbox"});
        let n = null;

        switch(data.inputType) // this works for create only...
        {
            case "Select":
                n = HTML.create("select");
                HTML.addOptions(n, data.selectList.map(o =>
                {
                    return {text: o, value: o};
                }));
                break;

            case "Number":
                n = HTML.create("input", {type: "number", min: 0, value: 0});
                break;

            case "String":
                n = HTML.create("input", {type: "string"});
                break;

            default:
                throw new Error(`Unknown metadata input type [${data.inputType}]`);
        }

        this.metadata.set(data.id, {check: cb, value: n});
        tempDiv.append(cb, HTML.createLabel(data.id + ": ", n));
        this.div.append(tempDiv);
    }
}