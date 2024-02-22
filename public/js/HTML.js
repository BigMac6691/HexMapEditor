class HTML
{
    constructor()    {    }

    static createLabel(prefix, input, suffix)
    {
        const n = document.createElement("label");
        n.append(!prefix ? "" : prefix, input, !suffix ? "" : suffix);

        return n;
    }

    static create(type, opts, clazz, listeners)
    {
        const n = document.createElement(type);

        if(opts)
            for(const [k, v] of Object.entries(opts))
                n[k] = v;

        if(clazz)
            clazz.forEach(c => n.classList.add(c));

        if(listeners)
            for(const [k, v] of Object.entries(listeners))
                n.addEventListener(k, v);

        return n;
    }
}