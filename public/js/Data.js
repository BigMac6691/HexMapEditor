let DATA = 
{
    "metadata" :
    {
        "columns" : 15,
        "rows" : 15
    },
    "defs" :
    [
        {
            "type" : "linearGradient",
            "data" : {id: "topLeftFade", x1: "0", y1: "0", x2: "0", y2: 1},
            "children" : 
            [
                {
                    "type" : "stop",
                    "data" : {offset: "0%", "stop-color": "#ff0000"},
                    "children" : []
                },
                {
                    "type" : "stop",
                    "data" : {offset: "10%", "stop-color": "#ff0000", "stop-opacity": "0.5"},
                    "children" : []
                },
                {
                    "type" : "stop",
                    "data" : {offset: "20%", "stop-color": "#ff0000", "stop-opacity": "0.2"},
                    "children" : []
                },
                {
                    "type" : "stop",
                    "data" : {offset: "100%", "stop-color": "#ff0000", "stop-opacity": "0"},
                    "children" : []
                }
            ]
        },
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
    ]
/*
    Structure of edge corners array of the label/id of the corner must match the edge?
    {
        label : river, forest, etc... this is what you see in drop down
        data: [0 = top right, 1 = right, etc...][variants 0..n]
    }

    Structure of connectors array of
    {
        label : road, railroad, etc... this is what you see in drop down
        data : [0 = top, 1 = top right, etc...][variants 0..n]
    }

    Structure of terrain this is very close to the same as the others
    {
        label : forest, hill, mountain, etc... this is what you see in drop down
        data : [variants 0..n]
    }

    Structure of of jumps? this is different
    {
        label : jump?
        data : from and to
    }

    Metadata is just a list of attributes the user has defined to be of interest and importance in the game.
    Hexes will need some way to know when to show a border based on meta data.
    {
        field : metadata attribute name
        data : how to draw the border when neighboring hex has different metadata value (from the inside)
    }
     */
}