class SVG
{
    constructor()    {    }

    static NS = "http://www.w3.org/2000/svg";
    static XNS = "http://www.w3.org/1999/xlink";

    static create(type, opts)
    {
        let n = document.createElementNS(this.NS, type);

        if(opts)
            for(const[k, v] of Object.entries(opts))
                n.setAttribute(k, v);

        return n;
    }

    static createUse(link, opts)
    {
        let n = document.createElementNS(this.NS, "use");

        if(opts)
            for(const[k, v] of Object.entries(opts))
                n.setAttribute(k, v);

        n.setAttributeNS(this.XNS, "href", "#" + link);

        return n;
    }

    static createText(text, opts)
    {
        let n = document.createElementNS(this.NS, "text");

        if(opts)
            for(const[k, v] of Object.entries(opts))
                n.setAttribute(k, v);

        n.append(document.createTextNode(text));

        return n;
    }
}