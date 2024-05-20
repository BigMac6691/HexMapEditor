class HexMapEditor
{
    constructor() 
    {
        // alternative to numerous bound speciclized event handlers - one handler that then redirects to specialized handlers
        this.boundSVGChange = this.handleSVGChange.bind(this);
        this.boundMapModelChange = this.handleMapModelChange.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseClick = this.handleMouseClick.bind(this);
        this.boundKeypress = this.handleKeypress.bind(this);
        
        this.painting = false;

        this.hexMap = new HexMap();
        this.hexMap.svg.addEventListener("mousemove", this.boundMouseMove);
        this.hexMap.svg.addEventListener("click", this.boundMouseClick);

        this.hexMap.svg.addEventListener("mouseenter", () => 
        {
            this.hexMap.svg.style.cursor = "crosshair";
            document.addEventListener("keydown", this.boundKeypress);
        });

        this.hexMap.svg.addEventListener("mouseleave", () => 
        {
            this.hexMap.svg.style.cursor = "default";
            this.painting = false;
            document.removeEventListener("keydown", this.boundKeypress);
        });

        this.makeUI();
        this.hexMap.initMap();
    }

    makeUI()
    {
        let mp = document.getElementById("mapPanel");
        mp.append(this.hexMap.getSVG());

        // File panel
        let div0 = this.makeFileUI();

        // SVG attributes
        let div1 = this.makeSVGUI(mp);        

        // Model atributes
        let div2 = this.makeModelUI();

        // Hex attributes
        let div3 = this.makeHexUI();

        document.getElementById("controlPanel").append(div0, div1, div2, div3);
    }

    makeFileUI()
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "File"}));

        this.boundFileButtons = this.handleFileButtons.bind(this);

        let tempDiv = HTML.create("div", null, ["fileDiv"]);
        tempDiv.append(HTML.create("button", {type: "button", innerHTML: "Load"}, null, {click: this.boundFileButtons}));
        tempDiv.append(HTML.create("button", {type: "button", innerHTML: "Save"}, null, {click: this.boundFileButtons}));
        tempDiv.append(this.fileName = HTML.create("div", {innerHTML: "- no current file -"}));
        div.append(tempDiv);

        return div;
    }

    makeSVGUI(mp)
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "SVG Attributes"}));

        let vbDiv = HTML.create("div");
        this.viewBoxWidth = HTML.create("input", {type: "number", value: "1000"}, null, {change: this.boundSVGChange});
        vbDiv.append(HTML.createLabel("View Box Width: ", this.viewBoxWidth));

        this.viewBoxHeight = HTML.create("input", {type: "number", value: "866"}, null, {change: this.boundSVGChange});
        vbDiv.append(HTML.createLabel(" Height: ", this.viewBoxHeight));
        div.append(vbDiv);

        let svgDiv = HTML.create("div");
        this.mapWidth = HTML.create("input", {type: "number", name: "width", value: mp.scrollWidth}, null, {change: this.boundSVGChange});
        svgDiv.append(HTML.createLabel("SVG Width: ", this.mapWidth, "px"));

        this.mapHeight = HTML.create("input", {type: "number", name: "height", value: mp.scrollHeight}, null, {change: this.boundSVGChange});
        svgDiv.append(HTML.createLabel(" Height: ", this.mapHeight, "px"));
        div.append(svgDiv);

        this.backgroundColour = HTML.create("input", {type: "color", value: "#0000ff"}, null, {change: this.boundSVGChange});
        div.append(HTML.createLabel("Background: ", this.backgroundColour));

        return div;
    }

    makeModelUI()
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "Model Attributes"}));

        let tempDiv = HTML.create("div");
        this.cols = HTML.create("input", {type: "number", value: this.hexMap.hexes.length, min: 1}, null, {change: this.boundMapModelChange});
        tempDiv.append(HTML.createLabel("Map Columns: ", this.cols));

        this.rows = HTML.create("input", {type: "number", value: this.hexMap.hexes[0].length, min: 1}, null, {change: this.boundMapModelChange});
        tempDiv.append(HTML.createLabel(" Rows: ", this.rows));
        div.append(tempDiv);

        tempDiv = HTML.create("div");
        this.borderColour = HTML.create("input", {type: "color", value: this.hexMap.borderColour}, null, {change: this.boundMapModelChange});
        tempDiv.append(HTML.createLabel("Border: ", this.borderColour));

        this.defaultTerrainColour = HTML.create("input", {type: "color", value: this.hexMap.defaultHexFill}, null, {change: this.boundMapModelChange});
        tempDiv.append(HTML.createLabel(" Hex: ", this.defaultTerrainColour));

        this.textColour = HTML.create("input", {type: "color", value: this.hexMap.textColor}, null, {change: this.boundMapModelChange});
        tempDiv.append(HTML.createLabel(" Text: ", this.textColour));
        div.append(tempDiv);

        this.offsetCheckbox = HTML.create("input", {type: "checkbox", checked: this.hexMap.offsetOn}, null, {change: this.boundMapModelChange});
        div.append(HTML.createLabel("Hex offset: ", this.offsetCheckbox));

        return div;
    }

    makeHexUI()
    {
        let div = HTML.create("div", null, ["controlDiv"]);
        div.append(HTML.create("h3", {textContent: "Hex Attributes"}));

        this.mouseMove = HTML.create("p", {innerHTML: "Mouse location x, y"});
        this.mouseClick = HTML.create("p", {innerHTML: "Click location: x, y"});
        div.append(this.mouseMove, this.mouseClick);

        this.boundMenuClick = this.handleMenu.bind(this);
        this.boundJumpChange = this.handleJumpChange.bind(this);
        this.boundJumpSelect = this.handleJumpSelect.bind(this);
        this.boundJumpButtons = this.handleJumpButtons.bind(this);

        let list = ["None", "Terrain", "Edges", "Connectors", "Jumps", "Meta", "Content"];

        this.menuList = new Map();
        let menu = HTML.create("div", null, ["menuContainer"]);
        div.append(menu);

        list.forEach(m => 
        {
            let n = HTML.create("div", {innerHTML: m}, ["menuItem"], {click: this.boundMenuClick});
            menu.append(n);
            switch(m)
            {
                case list[0]:
                    n.classList.add("menuItemSelected"); // initial menu option
                    this.menuList.set(n, HTML.create("div"));
                    break;
                case list[1]:
                    this.terrainSelect = new ComboRadioSelect(this.hexMap.terrainTypes, "terrainCRS");
                    this.menuList.set(n, this.terrainSelect.groupDiv);
                    div.append(this.terrainSelect.groupDiv);
                    break;
                case list[2]:
                    this.edgeSelect = new ComboRadioSelect(this.hexMap.edgeTypes, "edgeCRS");
                    this.menuList.set(n, this.edgeSelect.groupDiv);
                    div.append(this.edgeSelect.groupDiv);
                    break;
                case list[3]:
                    this.connectorSelect = new ComboRadioSelect(this.hexMap.connectorTypes, "connectorCRS");
                    this.menuList.set(n, this.connectorSelect.groupDiv);
                    div.append(this.connectorSelect.groupDiv);
                    break;
                case list[4]:
                    div.append(this.buildJumpDiv(n));
                    break;
                case list[5]:
                    div.append(this.buildMetaDiv(n));
                    break;
                case list[6]:
                    this.menuList.set(n, HTML.create("div"));
                    break;
            }
        });

        return div;
    }

    buildJumpDiv(menuNode)
    {
        let div = HTML.create("div", {style: "display:none"});
        let tempDiv = HTML.create("div", {style: "padding-bottom: 0.5em;"});

        this.jumpFromCol = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundJumpChange});
        this.jumpFromRow = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundJumpChange});
        tempDiv.append(HTML.createLabel("Jump from: ", this.jumpFromCol), HTML.createLabel(", ", this.jumpFromRow));

        this.jumpToCol = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundJumpChange});
        this.jumpToRow = HTML.create("input", {type: "number", value: "0", min: "0"}, ["jumpInput"], {change: this.boundJumpChange});
        tempDiv.append(HTML.createLabel(" to ", this.jumpToCol), HTML.createLabel(", ", this.jumpToRow));
        div.append(tempDiv);

        tempDiv = HTML.create("div");
        this.jumpCreate = HTML.create("button", {type: "button", innerHTML: "Create"}, null, {click: this.boundJumpButtons});
        this.jumpDelete = HTML.create("button", {type: "button", innerHTML: "Delete", style: "display:none"}, null, {click: this.boundJumpButtons});
        this.jumpSelect = HTML.create("select", null, null, {change: this.boundJumpSelect});

        let data = [{text: "New Jump", value: "new"}];
        this.hexMap.jumps.forEach((v, k) => data.push({text: `Jump ${v.from} to ${v.to}`, value: k}));
        HTML.addOptions(this.jumpSelect, data);
        tempDiv.append(HTML.createLabel("Jumps: ", this.jumpSelect), " ", this.jumpCreate, " ", this.jumpDelete);
        
        this.menuList.set(menuNode, div);
        
        div.append(tempDiv);

        return div;
    }

    buildMetaDiv(menuNode)
    {
        let metaDiv = HTML.create("div", {style: "display:none"});
        this.metadata = new Map();

        for(const[k, v] of this.hexMap.metadata)
        {
            let tempDiv = HTML.create("div");
            let cb = HTML.create("input", {type: "checkbox"});

            if(v.editor.type === "select")
            {
                let n = HTML.create("select");
                HTML.addOptions(n, v.editor.values.map(o =>
                {
                    return {text: o, value: o};
                }));

                this.metadata.set(k, [cb, n]);
                tempDiv.append(cb, HTML.createLabel(k + " ", n));
                metaDiv.append(tempDiv);
            }
            else if(v.editor.type === "input")
            {
                let n = HTML.create("input", v.editor.opts);

                this.metadata.set(k, [cb, n]);
                tempDiv.append(cb, HTML.createLabel(k + ": ", n));
                metaDiv.append(tempDiv);
            }
            else
                throw new Error(`Unknown metadata type [${v.type}]`);
        }

        this.menuList.set(menuNode, metaDiv);
        
        return metaDiv;
    }

    handleFileButtons(evt)
    {
        console.log(evt.target.innerHTML);
    }

    handleMenu(evt)
    {
        let currentMenu = document.querySelector(".menuItemSelected");
        currentMenu.classList.remove("menuItemSelected");
        this.menuList.get(currentMenu).style.display = "none";

        evt.target.classList.add("menuItemSelected");
        this.menuList.get(evt.target).style.display = "block";
    }

    handleKeypress(evt)
    {
        if(document.querySelector(".menuItemSelected")?.innerHTML === "Jumps")
            return;

        this.painting = !this.painting;

        if(this.painting)
            this.hexMap.svg.style.cursor = "cell";
        else
            this.hexMap.svg.style.cursor = "crosshair";
    }

    handleSVGChange(evt)
    {
        if(evt.target === this.viewBoxWidth || evt.target === this.viewBoxHeight)
        {
            this.hexMap.getSVG().setAttribute("viewBox", `0 0 ${this.viewBoxWidth.value} ${this.viewBoxHeight.value}`);
            // this.recalculatePolygon();
        }
        else if(evt.target === this.backgroundColour)
            this.hexMap.getSVG().style.background = evt.target.value;
        else
            this.hexMap.getSVG().setAttribute(evt.target.name, evt.target.value);
    }

    handleMapModelChange(evt)
    {
        this.hexMap.borderColour = this.borderColour.value;
        this.hexMap.defaultHexFill = this.defaultTerrainColour.value;

        let c = +this.cols.value;
        let r = +this.rows.value;
        let model = this.hexMap.hexes;
        let modelChange = c != model.length || r != model[0].length || this.hexMap.offsetOn != (this.offsetCheckbox.checked ? 1 : 0);

        this.hexMap.offsetOn = (this.offsetCheckbox.checked ? 1 : 0);
        this.hexMap.textColor = this.textColour.value;

        // Handle column changes
        if(c < model.length)
            model.length = c;
        else if(c > model.length)
        {
            while(model.length < c)
                model.push(Array.from({length: model[0].length}, (_, n) => new Hex(this.hexMap, model.length, n)));
        }

        // Handle row changes
        if(r < model[0].length)
            model.forEach(row => row.length = r);
        else if(r > model[0].length)
        {
            let n = r - model[0].length;

            for(let ci = 0; ci < model.length; ci++)
                for(let ri = 0; ri < n; ri++)
                    model[ci].push(new Hex(this.hexMap, ci, model[ci].length))
        }

        if(modelChange)
        {
            let mapPanel = document.getElementById("mapPanel");
            mapPanel.style.fontSize = `${100 / (this.hexMap.hexes[0].length + (this.hexMap.hexes.length > 1 ? 0.5 : 0))}px`;

            this.hexMap.cursor.x = Math.min(this.hexMap.hexes.length - 1, this.hexMap.cursor.x);
            this.hexMap.cursor.y = Math.min(this.hexMap.hexes[0].length - 1, this.hexMap.cursor.y);

            this.hexMap.initMap();
        }
        else
            this.hexMap.drawMap();
    }

    handleMouseMove(evt)
    {
        if(!evt.target.id.includes(","))
            return;

        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.hexMap.svg.getScreenCTM().inverse());
        this.mouseMove.innerHTML = `Mouse location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} in hex ${evt.target.id} isPainting ${this.painting}`;

        if(this.painting)
        {
            if(document.querySelector(".menuItemSelected")?.innerHTML === "Jumps")
                this.updateJump(evt.target.id, false);
            else
                this.updateHex(evt.target.id, pt);
        }
    }

    handleMouseClick(evt)
    {
        if(!evt.target.id.includes(","))
            return;

        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.hexMap.svg.getScreenCTM().inverse());
        this.mouseClick.innerHTML = `Click location: ${Math.trunc(pt.x * 100) / 100}, ${Math.trunc(pt.y * 100) / 100} with id ${evt.target.id}`;

        if(document.querySelector(".menuItemSelected")?.innerHTML === "Jumps")
            this.updateJump(evt.target.id, true);
        else
            this.updateHex(evt.target.id, pt);
    }

    handleJumpButtons(evt)
    {
        if(evt.target === this.jumpCreate)
        {
            let index = this.hexMap.jumpNextIndex++;
            let jump = 
            {
                from: `${+this.jumpFromCol.value},${+this.jumpFromRow.value}`, 
                to:`${+this.jumpToCol.value},${+this.jumpToRow.value}`,
                svg: this.jumpLine
            };
        
            this.hexMap.jumps.set(index, jump);
            HTML.addOptions(this.jumpSelect, [{text: `Jump ${jump.from} to ${jump.to}`, value: index}]);

            this.jumpSelect.value = index;
            this.jumpSelect.dispatchEvent(new Event("change"));
        }
        else if(evt.target === this.jumpDelete)
        {
            let index = this.jumpSelect.selectedIndex;
            let jump = this.hexMap.jumps.get(+this.jumpSelect.value);

            this.jumpLine = null;
            this.hexMap.jumps.delete(+this.jumpSelect.value);
            this.hexMap.map.removeChild(jump.svg);

            this.jumpSelect.value = "new";
            this.jumpSelect.dispatchEvent(new Event("change"));
            this.jumpSelect.remove(index);
        }
    }

    updateJump(id, endPoint)
    {
        let coords = id.split(",");
        let hex = this.hexMap.getHexFromId(id);

        let x = +hex.hexTerrain.x.baseVal.value + hex.hexTerrain.width.baseVal.value / 2;
        let y = +hex.hexTerrain.y.baseVal.value + hex.hexTerrain.height.baseVal.value / 2

        if(this.jumpStart) // start point already selected
        {
            this.jumpLine.setAttribute("x2", x);
            this.jumpLine.setAttribute("y2", y);

            this.jumpToCol.value = coords[0];
            this.jumpToRow.value = coords[1];
            
            if(endPoint) // mouse was clicked to create jump end
            {
                this.painting = false;
                this.jumpStart = null;
            }
        }
        else
        {
            if(this.jumpSelect.value === "new")
            {
                this.jumpLine = SVG.create("line", {x1: x, y1: y, x2: x, y2: y, stroke: "#ff0000", "stroke-width": "6", class: "jumpLine"});
                this.hexMap.map.append(this.jumpLine);
            }
            else
            {
                this.jumpLine = this.hexMap.jumps.get(+this.jumpSelect.value).svg;
                this.jumpLine.setAttribute("x1", x);
                this.jumpLine.setAttribute("y1", y);
            }

            this.jumpFromCol.value = coords[0];
            this.jumpFromRow.value = coords[1];

            this.jumpStart = hex;
            this.painting = true;           
        }
    }

    handleJumpChange(evt) // column row inputs changed
    {
        let isFrom = evt.target === this.jumpFromCol || evt.target === this.jumpFromRow;
        let id = null;

        if(isFrom)
            id = this.jumpFromCol.value + "," + this.jumpFromRow.value;
        else
            id = this.jumpToCol.value + "," + this.jumpToRow.value;

        let hex = this.hexMap.getHexFromId(id);

        let x = +hex.hexTerrain.x.baseVal.value + hex.hexTerrain.width.baseVal.value / 2;
        let y = +hex.hexTerrain.y.baseVal.value + hex.hexTerrain.height.baseVal.value / 2;

        if(this.jumpSelect.value === "new")
        {
            if(!this.jumpStart)
            {
                this.jumpStart = this.hexMap.getHexFromId(`${this.jumpFromCol.value},${this.jumpFromRow.value}`);

                let startX = +this.jumpStart.hexTerrain.x.baseVal.value + this.jumpStart.hexTerrain.width.baseVal.value / 2;
                let startY = +this.jumpStart.hexTerrain.y.baseVal.value + this.jumpStart.hexTerrain.height.baseVal.value / 2;

                this.jumpLine = SVG.create("line", {x1: startX, y1: startY, x2: startX, y2: startY, stroke: "#ff0000", "stroke-width": "6", class: "jumpLine"});
                this.hexMap.map.append(this.jumpLine);
            }
        }
        else
        {
            this.jumpLine = this.hexMap.jumps.get(+this.jumpSelect.value).svg;
        }

        if(isFrom)
        {
            this.jumpLine.setAttribute("x1", x);
            this.jumpLine.setAttribute("y1", y);
        }
        else
        {
            this.jumpLine.setAttribute("x2", x);
            this.jumpLine.setAttribute("y2", y);
        }
    }

    handleJumpSelect(evt)
    {
        let ids = [];

        if(evt.target.value === "new")
        {
            ids = [0, 0, 0, 0];
            this.jumpLine = null;
            this.jumpCreate.style.display = "inline";
            this.jumpDelete.style.display = "none";
        }
        else
        {
            if(!Array.from(this.hexMap.jumps.values()).some(v => v.svg === this.jumpLine))
            {
                this.jumpLine.remove();
                this.jumpLine = null;
            }

            let jump = this.hexMap.jumps.get(+evt.target.value);

            ids.push(...jump.from.split(","), ...jump.to.split(","));
            this.jumpLine = jump.svg;
            this.jumpCreate.style.display = "none";
            this.jumpDelete.style.display = "inline";
        }

        this.jumpStart = null;
        this.painting = false;
        this.jumpFromCol.value = ids[0];
        this.jumpFromRow.value = ids[1];
        this.jumpToCol.value = ids[2];
        this.jumpToRow.value = ids[3];
    }

    nearestEdge(hex, pt)
    {
        let y = +hex.hexTerrain.y.baseVal.value;
        let h = hex.hexTerrain.height.baseVal.value / 4;
        let dy = pt.y - y;
        let rh = h / 5;

        let x = +hex.hexTerrain.x.baseVal.value;
        let w = hex.hexTerrain.width.baseVal.value / 4;
        let dx = pt.x - x;
        let rw = w / 5;
        let edgeIndex = -1;

        if(Math.abs(w / 2 - dx) < rw) //  top left and bottom left
            edgeIndex = Math.abs(h - dy) < rh ? 5 : (Math.abs(3 * h - dy) < rh ? 4 : -1);
        else if(Math.abs(3.5 * w - dx) < rw) // top right and bottom right
            edgeIndex = Math.abs(h - dy) < rh ? 1 : (Math.abs(3 * h - dy) < rh ? 2 : -1);
        else if(Math.abs(2 * w - dx) < rw) //  top and bottom
             edgeIndex = dy < rh ? 0 : (Math.abs(4 * h - dy) < rh ? 3 : -1);

        return edgeIndex;
    }

    updateHex(id, pt)
    {
        let currentMenu = document.querySelector(".menuItemSelected")?.innerHTML;

        if(!currentMenu || currentMenu === "None")
            return;

        let hex = this.hexMap.getHexFromId(id);

        if(currentMenu === "Terrain")
        {
            hex.setTerrain({type: this.terrainSelect.value, variant: 0});
        }

        if(currentMenu === "Edges") // need to develop a way to remove an edge, changing is easy.
        {
            let edgeIndex = this.nearestEdge(hex, pt);

            if(edgeIndex >= 0)
            {
                hex.addEdge({"edge" : this.edgeSelect.value, "edgeIndex" : edgeIndex, "variant" : 0});

                let offset = this.hexMap.offsetOn ? (hex.col % 2 ? -1 : 0) : (hex.col % 2 ? 0 : -1);
                let adj = 
                [
                    this.hexMap.getHexFromId(`${hex.col},${hex.row - 1}`),
                    this.hexMap.getHexFromId(`${hex.col + 1},${hex.row + offset}`),
                    this.hexMap.getHexFromId(`${hex.col + 1},${hex.row + offset + 1}`),
                    this.hexMap.getHexFromId(`${hex.col},${hex.row + 1}`),
                    this.hexMap.getHexFromId(`${hex.col - 1},${hex.row + offset + 1}`),
                    this.hexMap.getHexFromId(`${hex.col - 1},${hex.row + offset}`)
                ];

                this.evaluateCorner(hex, adj, edgeIndex);
                this.evaluateCorner(hex, adj, (edgeIndex + 5) % 6); 
            }
        }
        
        if(currentMenu === "Connectors") // roads and rails
        {
            let edgeIndex = this.nearestEdge(hex, pt);

            if(edgeIndex >= 0)
                hex.addConnector({"edge": this.connectorSelect.value, "edgeIndex": edgeIndex, "variant": 0});
        }

        if(currentMenu === "Meta") // country resources 
        {
            let value = new Map();
            for(const [k, v] of this.metadata)
                if(v[0].checked)
                    value.set(k, v[1].value);

            hex.addMetadata(value);
        }

        if(currentMenu === "Content") // units
            hex.terrain = this.terrain.get(this.terrainSelect.value);
    }

    evaluateCorner(hex, adj, cornerIndex)
    {
        let edgeBefore = hex.edges ? hex.edges.partialHas({"edgeIndex": cornerIndex}) : false;
        let edgeAfter = hex.edges ? hex.edges.partialHas({"edgeIndex": (cornerIndex + 1) % 6}) : false;
        let edgeOpp1 = adj[cornerIndex]?.edges ? adj[cornerIndex].edges.partialHas({"edgeIndex": (cornerIndex + 2) % 6}) : false;
        let edgeOpp2 = adj[(cornerIndex + 1) % 6]?.edges ? adj[(cornerIndex + 1) % 6].edges.partialHas({"edgeIndex": (cornerIndex + 5) % 6}) : false;
        let corner = edgeBefore ? 1 : 0;

        if(edgeAfter)
            corner +=2;

        if(edgeBefore && !edgeAfter)
            corner += edgeOpp2 ? 3 : 0;

        if(!edgeBefore && edgeAfter)
            corner += edgeOpp1 ? 3 : 0;

        if(corner > 0)
            hex.addCorner({"edge" : this.edgeSelect.value, "edgeIndex" : cornerIndex, "cornerType": corner - 1, "variant" : 0});
    }
}