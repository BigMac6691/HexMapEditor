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

        for(const [k, v] of mdList)
        {
            let key = {key: k, value: v};
            let valueFound = hex?.metadata?.partialHas(key);

            if(valueFound) // if no change in property value skip to next incoming property
                continue;

            let md = this.editor.hexMap.metadata.get(k);
            let matchKey = md.allowMultiples ? key : {key: k};
            let matches = hex.metadata ? hex.metadata.partialGetAll(matchKey, 2): []; // returns an array of arrays where the inner array is key-value pair

            if(matches.length > 0)
            {
                matches[0][1].forEach(n => n.remove()); // remove all visual elements in the current hex for this metadata
                hex.metadata.deleteKO(matches[0][0]); // remove the metadata record itself
            }

            if(md.renderType === "Border") 
            {
                let borders = [];
                let renderKeys = Array.from(md.renderData.keys());
                let adj = this.editor.hexMap.getAdjacent(hex);

                for(let side = 0; side < 6; side++)
                {
                    let borderId = renderKeys[side];

                    if(adj[side]?.metadata?.partialHas(key)) // an adjacent hex has the same property value
                    {
                        let oppId = renderKeys[(side + 3) % 6]; // look for side opposite this side
                        let oppMeta = adj[side].metadata.partialGet(key, 2);
                        let oppBorder = oppMeta[1].filter(b => b.href.baseVal === `#${oppId}`);

                        if(oppBorder)
                        {
                            oppBorder.forEach(b => b.remove()); // remove border between hexes with same metadata value

                            // the key is going to change so delete the old key and rebuild with the modified data
                            let keepSymbolId = oppMeta[0].symbolIds.filter(i => i !== oppId);
                            let keepSVG = oppMeta[1].filter(b => b.href.baseVal !== `#${oppId}`);
                            
                            adj[side].metadata.deleteKO(oppMeta[0]);
                            adj[side].metadata.setKO({key: k, value: v, symbolIds: keepSymbolId}, keepSVG)
                        }
                    }
                    else // just add the border to current hex
                    {
                        borders.push(borderId);
                    }
                } // for sides

                hex.addMetadata({key: k, value: v, symbolIds: borders}); // this will add all the visual border elements back
            }
            else if(md.renderType === "Icon")
            {
                let renderKeys = Array.from(md.renderData.keys());
                let icons = [];
                icons.push(renderKeys[0]);

                hex.addMetadata({key: k, value: v, symbolIds: icons});
            }
            else
                throw new Error(`Unknown rendering rule ${md.renderType} for metadata.`);
        } // for passed meta
    }
    
    deleteMetadata(hex)
    {
        let mdList = new Map();
        for(const [k, v] of this.metadata)
            if(v.check.checked)
                mdList.set(k, v.value.value);

        if(mdList.size === 0)
            return;

        for(const [k, v] of mdList)
        {
            let key = {key: k, value: v};
            let valueFound = hex?.metadata?.partialHas(key);

            if(!valueFound) // only delete if the value is found
                continue;

            let md = this.editor.hexMap.metadata.get(k);
            let matches = hex.metadata ? hex.metadata.partialGetAll(key, 2): []; // returns an array of arrays where the inner array is key-value pair

            if(matches.length > 0)
            {
                matches[0][1].forEach(n => n.remove()); // remove all visual elements in the current hex for this metadata
                hex.metadata.deleteKO(matches[0][0]); // remove the metadata record itself
            }

            if(md.renderType === "Border") 
            {
                let borders = [];
                let renderKeys = Array.from(md.renderData.keys());
                let adj = this.editor.hexMap.getAdjacent(hex);

                for(let side = 0; side < 6; side++)
                {
                    if(adj[side]?.metadata?.partialHas(key)) // an adjacent hex has the same property value
                    {
                        let oppId = renderKeys[(side + 3) % 6]; // look for side opposite this side
                        let oppMeta = adj[side].metadata.partialGet(key, 2);

                        borders = [...oppMeta[0].symbolIds, oppId];
                        oppMeta[1].forEach(n => n.remove());
                        adj[side].metadata.deleteKO(oppMeta[0]);

                        adj[side].addMetadata({key: k, value: v, symbolIds: borders});
                    }
                } // for sides
            }
            else if(md.renderType === "Icon")
            {
                console.log("Deleting Icon - doing nothing???");
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