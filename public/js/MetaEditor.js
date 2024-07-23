class MetaEditor
{
    constructor(editor)
    {
        this.editor = editor;
        this.metadata = new Map();
        this.div = HTML.create("div", {style: "display:none"});
    }

    handleMapLoad(evt)
    {
        console.log(evt);
        this.metadata.clear();

        for(const[k, v] of this.editor.hexMap.metadata)
        {
            let tempDiv = HTML.create("div", {style: "padding-bottom: 0.3em;"});
            let cb = HTML.create("input", {type: "checkbox"});

            if(v.editor.type === "select")
            {
                let n = HTML.create("select");
                HTML.addOptions(n, v.editor.values.map(o =>
                {
                    return {text: o, value: o};
                }));

                this.metadata.set(n, cb);
                tempDiv.append(cb, HTML.createLabel(k + ": ", n));
                this.div.append(tempDiv);
            }
            else if(v.editor.type === "input")
            {
                let n = HTML.create("input", v.editor.opts);

                this.metadata.set(n. cb);
                tempDiv.append(cb, HTML.createLabel(k + ": ", n));
                this.div.append(tempDiv);
            }
            else
                throw new Error(`Unknown metadata type [${v.type}]`);
        }
    }
}