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
            console.log(k);
            console.log(hex.metadata);
            let key = {key: k, value: v};
            console.log(key);

            // if we are to allow more than one instance of a type of metadata we need to use the complex key.
            // now the problem is how do we remove something?
            let valueFound = hex?.metadata?.partialHas(key);

            console.log(valueFound);

            if(valueFound) // if no change in property value skip to next incoming property
                continue;

            // if a value changes remove all svg elements for that key from selected hex only
            // so in cases where we have multiples this works but where it is singular it doesn't as the structure supports multiples and doesn't know it should be singular
            //      what happened is that a hex was already Country = Canada, I then tried to set it to Country = Mexico the result is the Country = [Canada, Mexico]
            let matches = hex.metadata ? hex.metadata.partialGetAll(key, 2): [];

            console.log(matches);

            if(matches.length > 0)
            {
                matches[0][1].forEach(n => hex.svg.removeChild(n));

                hex.metadata.deleteKO(matches[0][0])
            }

            let md = this.editor.hexMap.metadata.get(k);

            console.log(md);

            if(md.renderType === "Border") // at this point you know that a property value has changed
            {
                let borders = [];
                let renderKeys = Array.from(md.renderData.keys());

                console.log(renderKeys);

                for(let side = 0; side < 6; side++)
                {
                    let borderId = renderKeys[side];

                    console.log(`\nside=${side}, borderId=${borderId}`);
                    console.log(adj[side]);
                    console.log(adj[side]?.metadata?.partialHas(key));

                    // need to test this logic extensively ...
                    if(adj[side]?.metadata?.partialHas(key)) // an adjacent hex has the same property value
                    {
                        console.log("adjacent side has matching metadata!");
                        let oppId = renderKeys[(side + 3) % 6]; // look for side opposite this side
                        let borderSVGList = adj[side].metadata.partialGet(key);
                        let oppBorder = borderSVGList.filter(b => b.href.baseVal === `#${oppId}`);

                        console.log(oppBorder);

                        if(oppBorder)
                        {
                            oppBorder.forEach(b => b.remove());
                            console.log(adj[side].metadata);

                            let target = adj[side].metadata.partialGet(key, 2);
                            let keepSymbolId = target[0].symbolIds.filter(i => i !== oppId);
                            let keepSVG = borderSVGList.filter(b => b.href.baseVal !== `#${oppId}`);

                            console.log(target);
                            console.log(keepSymbolId);
                            console.log(keepSVG);
                            
                            adj[side].metadata.deleteKO(target[0]);
                            adj[side].metadata.setKO({key: k, value: v, symbolIds: keepSymbolId}, keepSVG)

                            console.log(adj[side].metadata);
                        }
                    }
                    else // just add the border
                    {
                        console.log("add border -> " + borderId);
                        borders.push(borderId);
                        // hex.addBorder({id: borderId}); // we are dropping this method.
                    }
                } // for sides

                console.log(borders);
                hex.addMetadata({key: k, value: v, symbolIds: borders});
            }
            else if(md.renderType === "Icon")
            {
                console.log("Adding Icon - doing nothing???");
            }
            else
                throw new Error(`Unknown rendering rule ${md.renderType} for metadata.`);
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