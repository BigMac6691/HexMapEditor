class HexMap
{
    constructor()
    {
        this.svg = SVG.create("svg", {viewBox: "0 0 1000 1000", preserveAspectRatio: "none"});
        this.hexes = [[new Hex(this.svg)]];
    }

    getSVG()
    {
        return this.svg;
    }

    getHexes()
    {
        return this.hexes;
    }

    drawMap()
    {
        while(this.svg.firstChild)
            this.svg.removeChild(this.svg.firstChild);

        let vb = this.svg.getAttribute("viewBox").split(/\s+|,/);

        console.log(vb);

        let w = +vb[2] / (3 * this.hexes.length + 1);
        let h = +vb[3] / (2 * this.hexes[0].length + (this.hexes.length > 1 ? 1 : 0));

        for(let col = 0; col < this.hexes.length; col++)
        {
            let offset = col % 2 === 0 ? 0 : h;

            for(let row = 0; row < this.hexes[col].length; row++)
                this.hexes[col][row].drawHex(w, h, col, row, offset);
        }
    }
}