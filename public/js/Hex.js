class Hex
{
    constructor(m)
    {
        this.hexMap = m;
    }

    drawPolygon()
    {

    }

    drawHex(w, h, col, row, offset)
    {
        const borderColour = this.hexMap.borderColour;
        const map = this.hexMap.getMap();

        if(w > 0)
            return;

        let x1 = 3 * w * col + w;
        let y1 = 2 * h * row + offset; // all following y values are relative to this so only offset here
        let x2 = x1 + 2 * w;
        let y2 = y1;
        map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: borderColour}));

        x1 = x2;
        y1 = y2;
        x2 = x1 + w;
        y2 = y1 + h;
        map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: borderColour}));

        x1 = x2;
        y1 = y2;
        x2 = x1 - w;
        y2 = y1 + h;
        map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: borderColour}));

        x1 = x2;
        y1 = y2;
        x2 = x1 - 2 * w;
        y2 = y1;
        map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: borderColour}));

        x1 = x2;
        y1 = y2;
        x2 = x1 - w;
        y2 = y1 - h;
        map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: borderColour}));

        x1 = x2;
        y1 = y2;
        x2 = x1 + w;
        y2 = y1 - h;
        map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: borderColour}));
    }

    updateHex()
    {

    }
}