class CornerEditor extends FeatureEditor
{
    constructor(map)
    {
        super(map);

        this.help = 
        "<h1>Corner (very complex)</h1>" + 
        "<p>A corner is one of the six vertices of the hexagon.  The corners are numbered from 0 (the top right) clockwise to 5; 1 is right and so on.</p>" + 
        "<p>A corner has depth (which is why it is not called vertex).  It is a rhombus with a side length of about &frac14; the hexagon's side length like so:</p>" +
        "<svg width='200px' viewBox='0 0 1000 866' preserveAspectRatio='none'>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='0' width='1000' height='866'></use>" +
        "<path d='M 634.5 0 L 750 0 L 807.7 100 L 692.3 100 Z' fill='#0000ff'></path>" + 
        "</svg>" + 
        "<p>The rendering routine is optimized for this geometry.  You are free to go outside this region at your own risk.</p>" +
        "<p>There are 5 types of corners that are selected based on the content of four surrounding edges.  The edge <i>before</i> a corner is the nearest counterclockwise edge in the hex, the edge <i>after</i> is clockwise.  There are also the two edges from the hexes that are adjacent to the corner.  Again in a clockwise manner the first edge is called <i>opp1</i> the second <i>opp2</i>.</p>" +
        
        "<ol start='0'>" +
        "<li>" +
        "<p>Only the edge <i>before</i> the corner is set.  Both <i>after</i> and <i>opposite-2</i> must be empty; <i>opposite-1</i> doesn't matter.</p>" +
        "<svg width='200px' viewBox='100 100 500 433' preserveAspectRatio='none'>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='0' width='571.4' height='346.4'></use>" +
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='346.4' width='571.4' height='346.4'></use>" +
        "<path d='M 362.3 346.4 L 428.3 346.4 L 395.3 386.4 Z' fill='#0000ff'></path>" + 
        "<path d='M 208.7 346.4 L 362.3 346.4 L 395.3 386.4 L 175.7 386.4 Z' fill='#00ff00'></path>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='428.6' y='173.2' width='571.4' height='346.4'></use>" +
        "<text x='375' y='250' style='font-size:50px' stroke='#000000'>opp1 any</text>" +
        "<text x='535' y='325' style='font-size:50px' stroke='#000000'>empty</text>" +
        "<text x='450' y='475' style='font-size:50px' stroke='#000000'>empty</text>" +
        "</svg>" + 
        "</li>" +
                
        "<li>" +
        "<p>Only the edge <i>after</i> the corner is set.  Both <i>before</i> and <i>opposite-1</i> must be empty; <i>opposite-2</i> doesn't matter.</p>" +
        "<svg width='200px' viewBox='200 100 500 433' preserveAspectRatio='none'>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='0' width='571.4' height='346.4'></use>" +
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='346.4' width='571.4' height='346.4'></use>" +
        "<path d='M 461.2 386.4 L 428.3 346.4 L 395.3 386.4 Z' fill='#0000ff'></path>" + 
        "<path d='M 395.3 386.4 L 461.2 386.4 L 537.9 479.6 L 505 519.6 Z' fill='#00ff00'></path>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='428.6' y='173.2' width='571.4' height='346.4'></use>" +
        "<text x='375' y='250' style='font-size:50px' stroke='#000000'>opp1 empty</text>" +
        "<text x='575' y='325' style='font-size:50px' stroke='#000000'>opp2 any</text>" +
        "<text x='310' y='375' style='font-size:50px' stroke='#000000'>empty</text>" +
        "</svg>" + 
        "</li>" +
        
        "<li>" +
        "<p>Both edges <i>inside</i> the hex are set.  Neither <i>opposite-1</i> nor <i>opposite-2</i> matter.</p>" +
        "<svg width='200px' viewBox='100 100 500 433' preserveAspectRatio='none'>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='0' width='571.4' height='346.4'></use>" +
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='346.4' width='571.4' height='346.4'></use>" +
        "<path d='M 461.2 386.4 L 428.3 346.4 L 362.3 346.4 L 395.3 386.4 Z' fill='#0000ff'></path>" + 
        "<path d='M 208.7 346.4 L 362.3 346.4 L 395.3 386.4 L 175.7 386.4 Z' fill='#00ff00'></path>" + 
        "<path d='M 395.3 386.4 L 461.2 386.4 L 537.9 479.6 L 505 519.6 Z' fill='#00ff00'></path>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='428.6' y='173.2' width='571.4' height='346.4'></use>" +
        "<text x='400' y='250' style='font-size:50px' stroke='#000000'>any</text>" +
        "<text x='535' y='325' style='font-size:50px' stroke='#000000'>any</text>" +
        "</svg>" + 
        "</li>" +
        
        "<li>" +
        "<p>Both the edge <i>before</i> the corner and <i>opposite-2</i> are set.  The edge <i>after</i> the corner must be empty; <i>opposite-1</i> does not matter.</p>" +
        "<svg width='200px' viewBox='125 100 500 433' preserveAspectRatio='none'>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='0' width='571.4' height='346.4'></use>" +
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='346.4' width='571.4' height='346.4'></use>" +
        "<path d='M 444.7 366.4 L 428.3 346.4 L 362.3 346.4 L 395.3 386.4 Z' fill='#0000ff'></path>" + 
        "<path d='M 208.7 346.4 L 362.3 346.4 L 395.3 386.4 L 175.7 386.4 Z' fill='#00ff00'></path>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='428.6' y='173.2' width='571.4' height='346.4'></use>" +
        "<path d='M 494.6 346.4 L 461.5 306.4 L 538.4 213.2 L 604.3 213.2 Z' fill='#00ff00'></path>" + 
        "<text x='400' y='250' style='font-size:50px' stroke='#000000'>opp1 any</text>" +
        "<text x='450' y='475' style='font-size:50px' stroke='#000000'>empty</text>" +
        "</svg>" + 
        "</li>" +
        
        "<li>" +
        "<p>Both the edge <i>after</i> the corner and <i>opposite-1</i> are set.  The edge <i>before</i> the corner must be empty; <i>opposite-2</i> does not matter.</p>" +
        "<svg width='200px' viewBox='200 100 500 433' preserveAspectRatio='none'>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='0' width='571.4' height='346.4'></use>" +
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='0' y='346.4' width='571.4' height='346.4'></use>" +
        "<path d='M 461.2 386.4 L 428.3 346.4 L 395.3 346.4 L 395.3 386.4 Z' fill='#0000ff'></path>" + 
        "<path d='M 505 173.2 L 537.9 213.2 L 461.2 306.4 L 395.3 306.4 Z' fill='#00ff00'></path>" + 
        "<path d='M 395.3 386.4 L 461.2 386.4 L 537.9 479.6 L 505 519.6 Z' fill='#00ff00'></path>" + 
        "<use stroke='#000000' stroke-width='2' fill='#aaaaaa' xlink:href='#hexagon' x='428.6' y='173.2' width='571.4' height='346.4'></use>" +
        "<text x='575' y='325' style='font-size:50px' stroke='#000000'>opp2 any</text>" +
        "<text x='300' y='375' style='font-size:50px' stroke='#000000'>empty</text>" +
        "</svg>" + 
        "</li>" +
        "</ol>" +

        "<p>You can define variants for each type of corner.  When a hex is assigned a corner value it will randomly pick from the available variants; you can edit this manually later if you like.  <b>IMPORTANT</b> the variants are numbered starting from zero so do not leave gaps in the sequence!</p>" +
        "<p>The SVG you provided to render the edge is captured in a <code>symbol</code> with <code>viewBox</code> of 0 0 1000 866, <code>preserveAspectRatio</code> and <code>pointer-events</code> set to 'none'. The symbol id is composed as follows: ID_eEdge_cCorner_vVariant, example: River_e0_c0_v0 is ID of River top edge, simple closing corner and variant 0.</p>" +
        "<p><b>NOTE</b> edges and corners are drawn first.</p>";

        this.edge = HTML.create("input", {type: "number", value: 0, min: 0, max: 5});
        this.corner = HTML.create("input", {type: "number", value: 0, min: 0, max: 4});
        this.variant = HTML.create("input", {type: "number", value: 0, min: 0});

        this.parts.append(
            HTML.createLabel("Edge: ", this.edge),
            HTML.createLabel("Corner: ", this.corner),
            HTML.createLabel("Variant: ", this.variant));
    }

    init(list)
    {
        super.init(list);

        list.forEach((v, k) => 
        {
            let key = JSON.parse(k);
            let record =
            {
                id: key.type,
                edge: key.edgeIndex,
                corner: key.cornerType,
                variant: key.variant,
                svg: v.innerHTML,
                node: v
            }

            this.items.set(v.id, record);
            this.idList.append(HTML.create("option", {text: v.id, value: v.id}));
        });
    }

    handleListChange(evt)
    {
        if(!this.items.has(evt.target.value))
            return;

        let v = this.items.get(evt.target.value);

        this.id.value = v.id;
        this.edge.value = v.edge;
        this.corner.value = v.corner;
        this.variant.value = v.variant;
        this.svg.value = v.svg;
    }

    handleCreate(evt)
    {
        if(!super.handleCreate(evt))
            return;

        let key = this.getKey();
        let n = SVG.create("symbol", {id: key, viewBox: "0 0 1000 866", preserveAspectRatio: "none", "pointer-events": "none"});
        n.innerHTML = this.svg.value;

        let v = 
        {
            id: this.id.value, 
            edge: this.edge.value,
            corner: this.corner.value,
            variant: this.variant.value, 
            svg: this.svg.value,
            node: n
        };

        this.items.set(key, v);
        this.idList.append(HTML.create("option", {text: key, value: key}));
        this.idList.value = key;
        this.hexMap.svg.append(n);
    }

    handleUpdate(evt)
    {
        if(!super.handleUpdate(evt))
            return;

        let v = this.items.get(this.getKey());

        v.svg = this.svg.value;
        v.node.innerHTML = this.svg.value;
    }

    handleDelete(evt)
    {
        if(!super.handleDelete(evt))
            return;

        this.idList.removeChild(this.idList.options[this.idList.selectedIndex]);
        this.hexMap.removeChild(this.items.get(this.getKey()).node);
        this.items.delete(this.getKey());

        this.id.value = "";
        this.edge.value = 0;
        this.corner.value = 0;
        this.variant.value = 0;
        this.svg.value = "";
    }

    handleShow()
    {
        let hex = this.hexMap.getHexFromId("0,0");
        let key = this.getKey();        
        let n = SVG.createUse(key);
        n.setAttribute("x", 0);
        n.setAttribute("y", 0);
        n.setAttribute("width", 1000);
        n.setAttribute("height", 866);

        hex.svg.append(n);
    }

    getKey()
    {
        return `${this.id.value}_e${this.edge.value}_c${this.corner.value}_v${this.variant.value}`;
    }
}