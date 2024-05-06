class HTML
{
    constructor()    {    }

    static createLabel(prefix, input, suffix)
    {
        const n = document.createElement("label");
        n.append(!prefix ? "" : prefix, input, !suffix ? "" : suffix);

        return n;
    }

    static createSelect(values, opts, clazz, listeners)
    {
        let select = this.create("select", opts, clazz, listeners);

        values.forEach((v, k) => select.append(HTML.create("option", {text: v, value: v})));

        return select;
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

    static addOptions(select, opts)
    {
        opts.forEach(opt =>
        {
            select.append(HTML.create("option", opt));
        });
    }
}