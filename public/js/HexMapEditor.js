class HexMapEditor
{
    constructor() 
    {
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseClick = this.handleMouseClick.bind(this);
        this.boundKeypress = this.handleKeypress.bind(this);
        
        this.painting = false;
        this.hexMap = new HexMap();

        this.initMap();
        this.makeUI();
    }

    initMap()
    {
        // we don't need to add these listeners as we are not creating a new hex map all the time
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

        this.hexMap.initMap();
    }

    makeUI()
    {
        let mp = document.getElementById("mapPanel");
        mp.append(this.hexMap.svg); 

        // File panel
        this.fileControl = new FileEditor("File", this);
        let div0 = this.fileControl.div;

        // SVG attributes
        this.svgControl = new SVGEditor("SVG Attributes", this);
        this.fileControl.addEventListener("mapLoad", this.svgControl.handleMapLoad.bind(this.svgControl));
        let div1 = this.svgControl.div;

        // Model atributes
        this.modelControl = new ModelControl("Model Attributes", this);
        this.fileControl.addEventListener("mapLoad", this.modelControl.handleMapLoad.bind(this.modelControl));
        let div2 = this.modelControl.div;

        // Hex attributes
        this.mapEditor = new MapEditor("MapData", this);
        this.fileControl.addEventListener("mapLoad", this.mapEditor.handleMapLoad.bind(this.mapEditor));
        this.hexUIDiv = this.mapEditor.div;//HTML.create("div", null, ["controlDiv"]);
        let div3 = this.hexUIDiv;//this.makeHexUI();

        // Feature editor 
        let div4 = this.makeFeatureDiv();
        
        let div5 = HTML.create("div", null, ["controlDiv"]);
        div5.append(HTML.create("h3", {textContent: "Hex Editor"}));

        document.getElementById("controlPanel").append(div0, div1, div2, div3, div4, div5);
    }

    makeHexUI()
    {
        while(this.hexUIDiv.lastElementChild)
            this.hexUIDiv.removeChild(this.hexUIDiv.lastElementChild);
        
        this.hexUIDiv.append(HTML.create("h3", {textContent: "Map Data"}));

        this.mouseMove = HTML.create("p", {innerHTML: "Mouse location x, y"});
        this.mouseClick = HTML.create("p", {innerHTML: "Click location: x, y"});
        this.hexUIDiv.append(this.mouseMove, this.mouseClick);

        this.boundMenuClick = this.handleMenu.bind(this);
        this.boundJumpChange = this.handleJumpChange.bind(this);
        this.boundJumpSelect = this.handleJumpSelect.bind(this);
        this.boundJumpButtons = this.handleJumpButtons.bind(this);

        let list = ["None", "Terrain", "Edges", "Connectors", "Jumps", "Meta"];

        list.forEach(m => 
        {
        //     switch(m)
        //     {
        //         case list[4]:
        //             this.hexUIDiv.append(this.buildJumpDiv(n));
        //             break;
        //         case list[5]:
        //             this.hexUIDiv.append(this.buildMetaDiv(n));
        //             break;
        //     }
        });

        return this.hexUIDiv;
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
            let tempDiv = HTML.create("div", {style: "padding-bottom: 0.3em;"});
            let cb = HTML.create("input", {type: "checkbox"});

            if(v.editor.type === "select")
            {
                let n = HTML.create("select");
                HTML.addOptions(n, v.editor.values.map(o =>
                {
                    return {text: o, value: o};
                }));

                this.metadata.set(k, [cb, n]);
                tempDiv.append(cb, HTML.createLabel(k + ": ", n));
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

    makeFeatureDiv()
    {
        this.featureUIDiv = HTML.create("div", null, ["controlDiv"]);
        this.featureUIDiv.append(HTML.create("h3", {textContent: "Feature Editor"}));

        let list = ["defs", "Terrain", "Edges", "Corners", "Connectors", "Meta"];

        this.featureList = new Map();
        let menu = HTML.create("div", {id: "featureMenu"}, ["menuContainer"]);
        this.featureUIDiv.append(menu);

        list.forEach(m => 
        {
            let n = HTML.create("div", {innerHTML: m}, ["menuItem"], {click: this.boundMenuClick});
            menu.append(n);

            switch(m)
            {
                case list[0]:
                    n.classList.add("menuItemSelected"); // initial menu option

                    this.defsEditor = new DefsEditor(this.hexMap);
                    this.defsEditor.display(true); // initial visible editor

                    this.featureList.set(n, this.defsEditor.uiDiv);
                    this.featureUIDiv.append(this.defsEditor.uiDiv);
                    break;
                case list[1]:
                    console.log(this.hexMap);
                    this.terrainEditor = new TerrainEditor(this.hexMap);
                    this.featureList.set(n, this.terrainEditor.uiDiv);
                    this.featureUIDiv.append(this.terrainEditor.uiDiv);
                    break;
                case list[2]:
                    this.edgeEditor = new EdgeEditor(this.hexMap);
                    this.featureList.set(n, this.edgeEditor.uiDiv);
                    this.featureUIDiv.append(this.edgeEditor.uiDiv);
                    break;
                case list[3]:
                    this.cornerEditor = new CornerEditor(this.hexMap);
                    this.featureList.set(n, this.cornerEditor.uiDiv);
                    this.featureUIDiv.append(this.cornerEditor.uiDiv);
                    break;
                case list[4]:
                    this.connectorEditor = new ConnectorEditor(this.hexMap);
                    this.featureList.set(n, this.connectorEditor.uiDiv);
                    this.featureUIDiv.append(this.connectorEditor.uiDiv);
                    break;
                case list[5]:
                    // this.hexUIDiv.append(this.buildMetaDiv(n));
                    this.featureList.set(n, HTML.create("div"));
                    break;
            }
        });

        return this.featureUIDiv;        
    }

    handleMenu(evt)
    {
        let parentMenu = evt.target.parentElement;
        let currentMenu = parentMenu.querySelector(".menuItemSelected");

        currentMenu.classList.remove("menuItemSelected");

        if(parentMenu.id === "mapDataMenu")
            this.menuList.get(currentMenu).style.display = "none";
        else
            this.featureList.get(currentMenu).style.display = "none";

        evt.target.classList.add("menuItemSelected");

        if(parentMenu.id === "mapDataMenu")
            this.menuList.get(evt.target).style.display = "block";
        else
            this.featureList.get(evt.target).style.display = "flex";
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

    // do I need mouse and click listeners here?
    handleMouseMove(evt)
    {
        if(!evt.target.id.includes(","))
            return;

        let pt = new DOMPoint(evt.clientX, evt.clientY).matrixTransform(this.hexMap.svg.getScreenCTM().inverse());

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
                this.jumpLine = SVG.create("line", {x1: x, y1: y, x2: x, y2: y, stroke: this.jumpColour.value, "stroke-width": this.jumpWidth.value, class: "jumpLine"});
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
            hex.setTerrain({type: this.terrainSelect.value, variant: 0});

        if(currentMenu === "Edges")
            this.addEdge(hex, pt);
        
        if(currentMenu === "Connectors") // roads and rails
            this.addConnector(hex, pt);

        if(currentMenu === "Meta") // country resources 
            this.addMetadata(hex);

        if(currentMenu === "Content") // units
            ;
    }

    handleNone(hex, map, value)
    {
        if(!map)
            return;

        let matches = map.partialGetAll({edgeIndex: value.edgeIndex}, 2);

        matches.forEach(v => 
        {
            hex.svg.removeChild(v[1]);
            map.deleteKO(v[0]);
        });
    }

    addEdge(hex, pt)
    {
        let edgeIndex = this.nearestEdge(hex, pt);

        if(edgeIndex >= 0)
        {
            let curEdgeType = null;
            let value = {"edge" : this.edgeSelect.value, "edgeIndex" : edgeIndex, "variant" : 0};

            if(value.edge === "None")
            {
                curEdgeType = hex?.edges?.partialHas({"edgeIndex": edgeIndex}) ? hex.edges.partialGet({"edgeIndex": edgeIndex}, 2)[0].edge : null;

                this.handleNone(hex, hex.edges, value);
            }
            else// if(!hex.edges || !hex.edges.partialHas(value))
            {
                curEdgeType = this.edgeSelect.value;

                hex.addEdge(value);
            }
            
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

            this.addCorner(hex, adj, curEdgeType, (edgeIndex + 5) % 6); // corner before edge
            this.addCorner(hex, adj, curEdgeType, edgeIndex); // corner after edge
        }
    }

    addCorner(hex, adj, edgeType, cornerIndex)
    {
        this.handleNone(hex, hex.corners, {"edge": edgeType, "edgeIndex": cornerIndex});

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
            hex.addCorner({"edge" : edgeType, "edgeIndex" : cornerIndex, "cornerType": corner - 1, "variant" : 0});
    }

    addConnector(hex, pt)
    {
        let edgeIndex = this.nearestEdge(hex, pt);

        if(edgeIndex >= 0)
        {
            let value = {"edge": this.connectorSelect.value, "edgeIndex": edgeIndex, "variant": 0};

            if(value.edge === "None")
                this.handleNone(hex, hex.connectors, value);
            else if(!hex.connectors || !hex.connectors.partialHas(value))
                hex.addConnector(value);
        }
    }

    addMetadata(hex)
    {
        let mdList = new Map();
        for(const [k, v] of this.metadata)
            if(v[0].checked)
                mdList.set(k, v[1].value);

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

        for(const [k, v] of mdList)
        {
            let valueChange = hex?.metadata?.get(k) !== v;

            if(!valueChange) // if no change in property value skip to next incoming property
                continue;

            hex.addMetadata({key: k, value: v});

            let md = this.hexMap.metadata.get(k);

            if(md.renderRules[0].type === "border") // at this point you know that a property value has changed
            {
                if(valueChange) // if a value changes remove all borders for that value from selected hex only
                {
                    for(let side = 0; side < 6; side++)
                    {
                        let borderId = `${md.renderRules[0].symbol}_${side}`;
                        let border = hex?.borders?.get(borderId);

                        if(border)
                        {
                            hex.svg.removeChild(border);
                            hex.borders.delete(borderId);
                        }
                    }
                }

                for(let side = 0; side < 6; side++)
                {
                    let borderId = `${md.renderRules[0].symbol}_${side}`;

                    if(v === adj[side]?.metadata?.get(k)) // an adjacent hex has the same property value
                    {
                        let oppId = `${md.renderRules[0].symbol}_${(side + 3) % 6}`; // look for side opposite this side
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
}