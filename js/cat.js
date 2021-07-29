var objF;
var page;
var obj;

let prueba = async(obj) => {
    for (let i = 0; i < 40; i++) {
        obj.push({
            n: (i + 1),
            c: `Camisas ${(i+1)}`,
            s: `camisas ${(i+1)}`,
            d: `${(i+1)}. Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui soluta tempore minima quibusdam dolorum aliquam porro dolores aut, sunt nam, rem quisquam repellat odit quia.`
        });
    }
    return obj;
}

let cargar = () => {
    objF = [];
    let cook = document.cookie.split(";");
    let f = true;
    obj = await prueba([]);
    for (let i = 0; i < cook.length && f; i++) {
        let name = cook[i].split("=");
        f = !name[0].includes("page");
        if (!f) page = name[1];
    }
    if (!page) {
        document.cookie = "page" + "=" + 1 + ";max-age=" + 1 * 60 * 60 + ";";
    }
    for (let i = 0; i < (obj.length / 4); i++) {
        objF.push([]);
    }
    for (let i = 0, j = 0; j < obj.length; j++) {
        if (objF[i].length < 4) {
            objF[i].push(obj[j])
        } else {
            i++;
            j--;
        }
    }
    page--;
    crearPieDePagina(page, objF.length);
    for (let i = 0; i < objF[page].length; i++) {
        crearTabla(objF[page][i]);
    }
}

let crearTabla = (data) => {
    let padre = document.getElementById('DatosDeTabla');
    let nav = document.createElement('nav');
    nav.className = "navbar navbar-expand-sm ml-1 mr-1 nav";
    nav.setAttribute('name', 'filaDeDatos');
    let button = document.createElement('button');
    button.className = "navbar-toggler border-danger bg-dark mx-auto mb-2 mt-2";
    button.type = "button";
    button.setAttribute('data-toggle', 'collapse');
    button.setAttribute('data-target', `#dato${data.n}`);
    button.setAttribute('aria-controls', `dato${data.n}`);
    button.setAttribute('aria-expanded', `dato${data.n}`);
    button.setAttribute('aria-label', `Toggle navigation`);
    let label = document.createElement('label');
    label.setAttribute('for', `dato${data.n}`);
    label.className = "text-white";
    label.innerText = `Ver Categoria ${data.n} `;
    let i = document.createElement('i');
    i.className = "fas fa-caret-down";
    label.appendChild(i);
    button.appendChild(label);
    nav.appendChild(button);
    let fila = document.createElement('div');
    fila.id = `dato${data.n}`
    fila.className = "row data text-center collapse navbar-collapse bg-white";
    fila.appendChild(crearColumna("col-sm-1 col-md-1 text-white bg-dark dato1 d-flex align-items-center", "#", data.n));
    fila.appendChild(crearColumna("col-sm-3 col-md-2 dato d-flex align-items-center", "Categoria", data.c));
    fila.appendChild(crearColumna("col-sm-2 col-md-2 text-white bg-dark dato1 d-flex align-items-center", "Slug", data.s));
    fila.appendChild(crearColumna("col-sm-2 col-md-4 dato d-flex align-items-center", "Descripcion", data.d));
    fila.appendChild(crearIconos(data.n));
    nav.appendChild(fila);
    padre.appendChild(nav);
}

let crearColumna = (claseColumna, forLabel, textLabel) => {
    let col1 = document.createElement('div');
    col1.className = claseColumna;
    col1.appendChild(crearLabel(forLabel, textLabel));
    return col1;
}

let crearLabel = (f, t) => {
    let label = document.createElement('label');
    label.className = "mt-2 mb-2 mx-auto text-justify";
    label.setAttribute("for", f);
    label.innerText = t;
    return label;
}

let crearIconos = (clave) => {
    let col1 = document.createElement('div');
    col1.className = "col-sm-4 col-md-3 text-white bg-dark dato1 d-flex align-items-center";
    let label = crearLabel("", "");
    let div = document.createElement('div');
    div.className = "btn-group";
    div.setAttribute('role', 'group');
    div.appendChild(crearButtons("btn btn-primary text-white mr-2", "#delete", "fas fa-edit", clave));
    div.appendChild(crearButtons("btn btn-success text-white mr-2", "#delete", "fas fa-list-alt", clave));
    div.appendChild(crearButtons("btn btn-danger text-white", "#delete", "fas fa-trash-alt", clave));
    label.appendChild(div);
    col1.appendChild(label);
    return col1;
}

let crearButtons = (clase, target, claseI, clave) => {
    let button = document.createElement('button');
    button.type = 'button';
    button.className = clase;
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', target);
    button.addEventListener('click', () => {
        let span = document.getElementById('codigoAEliminar');
        span.innerText = clave;
    }, false);
    let i = document.createElement('i');
    i.className = claseI;
    button.appendChild(i);
    return button;
}

let crearPieDePagina = (page, lim) => {
    page++;
    let padre = document.getElementById('pieDePaginaLista');
    padre.appendChild(crearItemDelPiePaginaFlechas((page > 1) ? "" : " disabled", "&laquo;", true, page));
    let min = calcularLimiteMin(page, lim);
    let max = calcularLimiteMax(page, lim);
    if (min > 1) {
        padre.appendChild(crearItemDePiePagina("", 1));
        padre.appendChild(crearItemDePiePagina(" disabled", "..."));
    }
    for (let i = min; i <= max; i++) {
        padre.appendChild(crearItemDePiePagina((page == i) ? " active" : "", i));
    }
    if (max < lim) {
        padre.appendChild(crearItemDePiePagina(" disabled", "..."));
        padre.appendChild(crearItemDePiePagina("", lim));
    }
    padre.appendChild(crearItemDelPiePaginaFlechas((page < lim) ? "" : " disabled", "&raquo;", false, page));
}

let calcularLimiteMax = (page, lim) => {
    if (page == 1) {
        if (page + 2 <= lim)
            return (page + 2);
        else if (page + 1 <= lim)
            return (page + 1);
        else
            return page;
    } else if (page == lim)
        return lim;
    else
        return ++page;
}

let calcularLimiteMin = (page, lim) => {
    if (page == 1)
        return page;
    else if (page == lim) {
        if (lim - 2 > 0)
            return (lim - 2)
        else if (lim - 1 > 0)
            return (lim - 1)
        else
            return --page;
    } else
        return --page;
}

let crearItemDelPiePaginaFlechas = (clase, direccion, op, page) => {
    let li = document.createElement('li');
    li.className = "page-item" + clase;;
    li.setAttribute('name', 'filaDeDatos');
    let button = document.createElement('button');
    button.className = "page-link";
    button.setAttribute("aria-label", "Previous");
    button.addEventListener('click', () => {
        moverse(page, op, false);
    }, false);
    let span = document.createElement('span');
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = direccion;
    button.appendChild(span);
    li.appendChild(button);
    return li;
}

let crearItemDePiePagina = (claseLi, item) => {
    let li = document.createElement('li');
    li.className = "page-item" + claseLi;
    li.setAttribute('name', 'filaDeDatos');
    let button = document.createElement('button');
    button.className = "page-link";
    button.innerText = item;
    button.addEventListener('click', () => {
        moverse(item, false, true)
    }, false);
    li.appendChild(button);
    return li;
}

let moverse = (page, op, d) => {
    page = (d) ? page : (op) ? page - 1 : page + 1;
    document.cookie = "page" + "=" + page + ";max-age=" + 1 * 60 * 60 + ";";
    actualizar(page);
}

let actualizar = (page) => {
    let filas = document.getElementsByName('filaDeDatos');
    for (let i = filas.length - 1; i > -1; i--) {
        filas[i].remove();
    }
    page--;
    crearPieDePagina(page, objF.length);
    for (let i = 0; i < objF[page].length; i++) {
        crearTabla(objF[page][i]);
    }
}

cargar();