class Hex
{
    constructor(m)
    {
        this.map = m;
    }

    drawHex(w, h, col, row, offset)
    {
        let x1 = 3 * w * col + w;
        let y1 = 2 * h * row + offset; // all following y values are relative to this so only offset here
        let x2 = x1 + 2 * w;
        let y2 = y1;
        this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

        x1 = x2;
        y1 = y2;
        x2 = x1 + w;
        y2 = y1 + h;
        this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

        x1 = x2;
        y1 = y2;
        x2 = x1 - w;
        y2 = y1 + h;
        this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

        x1 = x2;
        y1 = y2;
        x2 = x1 - 2 * w;
        y2 = y1;
        this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

        x1 = x2;
        y1 = y2;
        x2 = x1 - w;
        y2 = y1 - h;
        this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));

        x1 = x2;
        y1 = y2;
        x2 = x1 + w;
        y2 = y1 - h;
        this.map.append(SVG.create("line", {"x1" : x1, "y1": y1, "x2": x2, "y2": y2, stroke: "black"}));
    }

    updateHex()
    {

    }
}