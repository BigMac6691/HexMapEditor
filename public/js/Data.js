let DATA = 
{
    "mapMetadata" :
    {
        "columns" : 2,
        "rows" : 2,
        "borderColor" : "#000000",
        "defaultHexFill" : "#ffffff",
        "offsetOn": 1
    },
    "defs" :
    [
        {
            "type" : "pattern",
            "data" : {id: "cityPattern", x: "0", y: "0", width: "45", height: "45", patternUnits: "userSpaceOnUse"},
            "children": 
            [
                {
                    "type" : "rect",
                    "data" : {width: "45", height: "45", fill: "#ffffff"},
                    "children" : []
                },
                {
                    "type" : "line",
                    "data" : {x1: "23", y1: "0", x2: "23", y2: "45", stroke: "#000000", "stroke-width": "3"},
                    "children" : []
                },
                {
                    "type" : "line",
                    "data" : {x1: "0", y1: "23", x2: "45", y2: "23", stroke: "#000000", "stroke-width": "3"},
                    "children" : []
                }
            ]
        }
    ],
    "terrain" :
    [
        {
            "label" : "Clear",
            "data" : {fill : "#ffffff"}
        },
        {           
            "label": "Forest",
            "data": {fill: "#00ff00"}
        },
        {
            "label": "Hills", 
            "data" : {fill: "#e06500"}
        },
        {
            "label": "Mountain",
            "data" : {fill: "#888888"}
        },
        {
            "label" : "Desert", 
            "data" : {fill: "#e9ec18"}
        },
        {
            "label": "Water", 
            "data" : {fill: "#0000ff"}
        },
        {
            "label" : "City", 
            "data" : {fill: "url(#cityPattern)"}
        }
    ],
    "edges":
    [
        {
            "label" : "None",
            "data" : [[],[],[],[],[],[]]
        },
        {
            "label" : "River",
            "data" :
            [
                [ // top edge
                    { // variant 1
                        "id" : "riverTT_1",
                        "svg" : {"d" : "M 365.5 0 L 634.5 0 L 692.3 100 L 307.7 100 Z", "fill": "#0000ff"}
                    }
                ],
                [ // top right edge
                    { // variant 1
                        "id" : "riverTR_1",
                        "svg" : {"d" : "M 692.3 100 L 807.7 100 L 942 333 L 884.5 433 Z", "fill": "#0000ff"}
                    }
                ],
                [ // bottom right edge
                    { // variant 1
                        "id" : "riverBR_1",
                        "svg" : {"d" : "M 884.5 433 L 942 533 L 807.7 766 L 692.3 766 Z", "fill": "#0000ff"}
                    }
                ],
                [ // bottom edge
                    { // variant 1
                        "id" : "riverBB_1",
                        "svg" : {"d" : "M 692.3 766 L 634.5 866 L 365.5 866 L 307.7 766 Z", "fill": "#0000ff"}
                    }
                ],
                [ // bottom left edge
                    { // variant 1
                        "id" : "riverBL_1",
                        "svg" : {"d" : "M 307.7 766 L 192.3 766 L 57.7 533 L 115.5 433 Z", "fill": "#0000ff"}
                    }
                ],
                [ // top left edge
                    { // variant 1
                        "id" : "riverTL_1",
                        "svg" : {"d" : "M 115.5 433 L 57.7 333 L 192.3 100 L 307.7 100 Z", "fill": "#0000ff"}
                    }
                ]
            ]
        }
    ],
    "connectors":
    [
        {
            "label" : "None",
            "data" : [[],[],[],[],[],[]]
        },
        {
            "label" : "Rail",
            "data" :
            [
                [ // top
                    { // variant 1
                        "id" : "railTT_1",
                        "innerHTML" : '<line x1="475" y1="0" x2="525" y2="0" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="43" x2="525" y2="43" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="87" x2="525" y2="87" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="130" x2="525" y2="130" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="173" x2="525" y2="173" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="216" x2="525" y2="216" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="260" x2="525" y2="260" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="303" x2="525" y2="303" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="346" x2="525" y2="346" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="389" x2="525" y2="389" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="475" y1="433" x2="525" y2="433" stroke="#b36800" stroke-width="20"/>' +
                                      '<line x1="486" y1="0" x2="490" y2="433" stroke="#999999" stroke-width="6"/>' +
                                      '<line x1="514" y1="0" x2="510" y2="433" stroke="#999999" stroke-width="6"/>'
                    }
                ],
                [// top right
                    { // variant 1
                        "id" : "railTR_1",
                        "innerHTML" : '<use xlink:href="#railTT_1" x="0" y="0" width="1000" height="866" transform="rotate(60, 500, 433)"></use>'
                    }
                ],
                [// bottom right
                    { // variant 1
                        "id" : "railBR_1",
                        "innerHTML" : '<use xlink:href="#railTT_1" x="0" y="0" width="1000" height="866" transform="rotate(120, 500, 433)"></use>'
                    }
                ],
                [// bottom
                    { // variant 1
                        "id" : "railBB_1",
                        "innerHTML" : '<use xlink:href="#railTT_1" x="0" y="0" width="1000" height="866" transform="rotate(180, 500, 433)"></use>'
                    }
                ],
                [// bottom left
                    { // variant 1
                        "id" : "railBL_1",
                        "innerHTML" : '<use xlink:href="#railTT_1" x="0" y="0" width="1000" height="866" transform="rotate(240, 500, 433)"></use>'
                    }
                ],
                [// top left
                    { // variant 1
                        "id" : "railTL_1",
                        "innerHTML" : '<use xlink:href="#railTT_1" x="0" y="0" width="1000" height="866" transform="rotate(300, 500, 433)"></use>'
                    }
                ]
            ]
        }
    ],
    "jumps":
    [
        // {"from": "7,1", "to": "12,7"}
    ],
    "borders":
    [
        {
            "id": "CountryBorder",
            "innerHtml": 
            [
                '<line x1="250" y1="0" x2="750" y2="0" stroke="#ff0000" stroke-width="30" stroke-dasharray="25,25"/>',
                '<line x1="750" y1="0" x2="1000" y2="433" stroke="#ff0000" stroke-width="30" stroke-dasharray="25,25"/>',
                '<line x1="1000" y1="433" x2="750" y2="866" stroke="#ff0000" stroke-width="30" stroke-dasharray="25,25"/>',
                '<line x1="750" y1="866" x2="250" y2="866" stroke="#ff0000" stroke-width="30" stroke-dasharray="25,25"/>',
                '<line x1="250" y1="866" x2="0" y2="433" stroke="#ff0000" stroke-width="30" stroke-dasharray="25,25"/>',
                '<line x1="0" y1="433" x2="250" y2="0" stroke="#ff0000" stroke-width="30" stroke-dasharray="25,25"/>'
            ]
        },
        {
            "id": "ProvincialBorder",
            "innerHtml": 
            [
                '<line x1="250" y1="0" x2="750" y2="0" stroke="#ff00ff" stroke-width="15" stroke-dasharray="25,25" stroke-dashoffset="25"/>',
                '<line x1="750" y1="0" x2="1000" y2="433" stroke="#ff00ff" stroke-width="15" stroke-dasharray="25,25" stroke-dashoffset="25"/>',
                '<line x1="1000" y1="433" x2="750" y2="866" stroke="#ff00ff" stroke-width="15" stroke-dasharray="25,25" stroke-dashoffset="25"/>',
                '<line x1="750" y1="866" x2="250" y2="866" stroke="#ff00ff" stroke-width="15" stroke-dasharray="25,25" stroke-dashoffset="25"/>',
                '<line x1="250" y1="866" x2="0" y2="433" stroke="#ff00ff" stroke-width="15" stroke-dasharray="25,25" stroke-dashoffset="25"/>',
                '<line x1="0" y1="433" x2="250" y2="0" stroke="#ff00ff" stroke-width="15" stroke-dasharray="25,25" stroke-dashoffset="25"/>'
            ]
        }
    ],
    "metadata": 
    [
        {
            "label" : "Country",
            "editor" :
            {
                "type" : "select",
                "values" : ["None", "Canada", "United States", "Mexico"]
            },
            "renderRules" : [{"type": "border", "symbol": "CountryBorder"}]
        }
        ,
        {
            "label" : "Province",
            "editor" :
            {
                "type" : "input",
                "opts" : {"type": "number", "min": "0", "value": "0"}
            },
            "renderRules" : [{"type": "border", "symbol": "ProvincialBorder"}]
        }
    ]
/*
    Structure of edge corners array of the label/id of the corner must match the edge?
    {
        label : river, forest, etc... this is what you see in drop down
        data: [0 = top right, 1 = right, etc...][variants 0..n]
    }

    Metadata is just a list of attributes the user has defined to be of interest and importance in the game.
    Start with two fields - country and province, then think about adding a third called control.
        Could very easily add others like population, resource type, resource value, etc.
    Hexes will need some way to know when to show a border based on meta data.
    {
        field : metadata attribute name
        data type : the type as used with the html input element?  selects will be complex...
        data : how to draw the border when neighboring hex has different metadata value (from the inside)

        renderRules: border, decoration (like iron ore symbol), label (like city name), none (no visual effect)
    }
     */
}