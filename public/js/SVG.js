class SVG
{
    constructor()    {    }

    static NS = "http://www.w3.org/2000/svg";

    static create(type, opts)
    {
        let n = document.createElementNS(this.NS, type);

        if(opts)
            for(const[k, v] of Object.entries(opts))
                n.setAttribute(k, v);

        return n;
    }

    static createText(opts)
    {
        let n = document.createElementNS(this.NS, "text");

        if(opts)
            for(const[k, v] of Object.entries(opts))
                n.setAttribute(k, v);

        n.append(document.createTextNode(opts.text));

        return n;
    }
}