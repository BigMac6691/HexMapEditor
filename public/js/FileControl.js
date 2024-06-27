/*
If I wanted to reuse this code I would not put the hex map and editor varibles
inside it.  What I want to do is have the code that deals with saving and 
loading in one centralized place.

The biggest drawback to this is that if the hex map variable is changed in the
editor it would have to change here as well. :(
*/
class FileControl extends ControlUI
{
    constructor(title, editor)
    {
        super(title);

        this.editor = editor;
        this.display = "flex";
        this.boundSave = this.handleSave.bind(this);
        this.boundLoad = this.handleLoad.bind(this);

        this.content.classList.add("fileDiv");
        this.content.append(HTML.create("button", {type: "button", innerHTML: "Load"}, null, {click: this.boundLoad}));
        this.content.append(HTML.create("button", {type: "button", innerHTML: "Save"}, null, {click: this.boundSave}));
        this.content.append(this.fileName = HTML.create("div", {innerHTML: "- no current file -"}));
    }

    handleSave(evt)
    {
        let fileName = prompt("Save file name:", this.fileName.innerHTML);

        if(!fileName)
            return;

        this.fileName.innerHTML = fileName;

        this.save(fileName);
        this.dispatchEvent(new CustomEvent("mapSave", {detail: fileName}));
    }

    save(fileName)
    {
        console.log(this.editor.hexMap);
        let data = {};
        ["offsetOn", "displayCursor", "borderColour", "defaultHexFill", "textColor", "viewBoxWidth", "viewBoxHeight", "mapWidth", "mapHeight", "backgroundColour", "cursor", "jumpColour", "jumpWidth"]
            .forEach(v => data[v] = this.editor.hexMap[v]);

        data.defs = [];
        for(let e of this.editor.hexMap.defs.children)
            data.defs.push(e.outerHTML);

        ["terrain", "terrainTypes", "edgeTypes", "cornerTypes", "connectorTypes"].forEach(v => data[v] = [...this.editor.hexMap[v]]);

        data.edges = [];
        this.editor.hexMap.edges.forEach((v, k) => data.edges.push([k, v.innerHTML]));

        data.corners = [];
        this.editor.hexMap.corners.forEach((v, k) => data.corners.push([k, v.innerHTML]));

        data.connectors = [];
        this.editor.hexMap.connectors.forEach((v, k) => data.connectors.push([k, v.innerHTML]));

        data.metadata = [];
        this.editor.hexMap.metadata.forEach((v, k) => data.metadata.push([k, v]));

        data.borders = [];
        this.editor.hexMap.borders.forEach((v, k) => data.borders.push([k, v]));

        data.jumps = [];
        this.editor.hexMap.jumps.forEach(v => data.jumps.push({"from": v.from, "to": v.to}));

        data.hexes = [];
        this.editor.hexMap.hexes.forEach(row =>
        {
            let rows = [];
            row.forEach(hex =>
            {
                let temp = {};

                ["col", "row", "terrain"].forEach(v => temp[v] = hex[v]);
                ["edges", "corners", "connectors", "borders", "content"].forEach(v => temp[v] = hex[v] ? [...hex[v].keys()] : null);
                ["metadata"].forEach(v => temp[v] = hex[v] ? [...hex[v]] : null);

                rows.push(temp);
            });

            data.hexes.push(rows);
        });

        localStorage.setItem(fileName, JSON.stringify(data));
        console.log(data);
    }

    handleLoad(evt)
    {
        let fileName = prompt("Load file name:", "test.hexmap");

        if(!fileName)
        {
            alert(`File ${fileName} not found or empty.`);
            return;
        }

        let file = localStorage.getItem(fileName);
        
        if(!file)
        {
            alert(`Error loading file ${fileName}.`);
            return;
        }

        console.log(`Size of file=${file.length}`);

        try
        {
            let data = JSON.parse(file);

            console.log(`Size of hexes=${JSON.stringify(data.hexes).length}`);
            console.log(data);

            this.fileName.innerHTML = fileName;

            this.load(data);
            this.dispatchEvent(new CustomEvent("mapLoad", {detail: data}));
        }
        catch(e)
        {
            console.log(e);
            alert(`Exception processing ${fileName}, see console for more details.`);
        }
    }

    load(data)
    {
        while(this.editor.hexMap.defs.lastChild)
            this.editor.hexMap.defs.removeChild(this.editor.hexMap.defs.lastChild);

        this.editor.hexMap.svg.querySelectorAll("symbol").forEach(n => 
        {
            if(n.id !== "hexagon")
                this.editor.hexMap.svg.removeChild(n);
        });

        this.editor.hexMap.loadFile(data);
        this.editor.initMap();
        
        console.log(data);
        // since all the following are in their own classes they need to listen for the load event
        // left is name in editor, right is name in hex map - need to fix that some day...
        [
            ["borderColour", "borderColour"],
            ["defaultTerrainColour", "defaultHexFill"],
            ["textColour", "textColor"]
        ].forEach(v => 
        {
            console.log(`[${v[0]},${v[1]}]-${data[v[1]]}`);
            this.editor[v[0]].value = data[v[1]] ?? this.editor[v[1]];
        });

        // currently missing in old file
        this.editor.jumpColour.value = "#ff0000";
        this.editor.jumpWidth.value = 6;
        
        this.editor.cols.value = data.hexes.length;
        this.editor.rows.value = data.hexes[0].length;
        this.editor.offsetCheckbox.checked = data.offsetOn === 1;
        this.editor.displayCursorCheckbox.checked = data.displayCursor ?? true;
        this.editor.makeHexUI();
        this.editor.defsEditor.init(this.editor.hexMap.defs.querySelectorAll("pattern"));
        this.editor.terrainEditor.init(this.editor.hexMap.terrain);
        this.editor.edgeEditor.init(this.editor.hexMap.edges);
    }
}