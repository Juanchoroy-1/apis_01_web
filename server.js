import express from "express";

const servidor = express();
servidor.use(express.json());
servidor.set("json spaces", 2);

let inventario = [
    { codigo: 1, producto: "Portátil Lenovo", costo: 2500000, unidades: 12 },
    { codigo: 2, producto: "Tablet Samsung", costo: 950000, unidades: 25 },
    { codigo: 3, producto: "Impresora multifuncional", costo: 680000, unidades: 18 },
    { codigo: 4, producto: "Parlante Bluetooth", costo: 125000, unidades: 52 },
    { codigo: 5, producto: "Cargador inalámbrico", costo: 85000, unidades: 29 },
    { codigo: 6, producto: "Disco duro externo 1TB", costo: 280000, unidades: 33 },
    { codigo: 7, producto: "Smartwatch", costo: 320000, unidades: 120 },
    { codigo: 8, producto: "Router WiFi 6", costo: 190000, unidades: 24 }
];

let contadorCodigo = 9;

servidor.use((req, res, next) => {
    const hora = new Date().toLocaleTimeString("es-CO");
    console.log(`${hora} -> ${req.method} ${req.originalUrl}`);
    next();
});

const esNumeroValido = (valor) => typeof valor === "number" && !Number.isNaN(valor) && valor >= 0;

servidor.get("/inventario", (req, res) => {
    const { buscar } = req.query;
    if (buscar) {
        const resultado = inventario.filter((item) =>
            item.producto.toLowerCase().includes(buscar.toLowerCase())
        );
        return res.status(200).json(resultado);
    }
    res.status(200).json(inventario);
});

servidor.get("/inventario/:codigo", (req, res) => {
    const codigo = Number(req.params.codigo);
    const item = inventario.find((x) => x.codigo === codigo);
    if (!item) return res.status(404).json({ mensaje: "El producto no existe en el inventario" });
    res.json(item);
});

servidor.post("/inventario", (req, res) => {
    const { producto, costo } = req.body;
    if (!producto || !esNumeroValido(costo)) {
        return res.status(400).json({ mensaje: "Debes enviar 'producto' y un 'costo' numérico válido" });
    }
    const nuevoItem = { codigo: contadorCodigo++, producto, costo, unidades: 0 };
    inventario.push(nuevoItem);
    res.status(201).json(nuevoItem);
});

servidor.put("/inventario/:codigo", (req, res) => {
    const codigo = Number(req.params.codigo);
    const indice = inventario.findIndex((x) => x.codigo === codigo);
    if (indice === -1) return res.status(404).json({ mensaje: "El producto no existe en el inventario" });

    const { producto, costo, unidades } = req.body;
    if (!producto || !esNumeroValido(costo) || !esNumeroValido(unidades)) {
        return res.status(400).json({ mensaje: "Se requieren 'producto', 'costo' y 'unidades' válidos" });
    }

    inventario[indice] = { codigo, producto, costo, unidades };
    res.status(200).json(inventario[indice]);
});

servidor.patch("/inventario/:codigo", (req, res) => {
    const codigo = Number(req.params.codigo);
    const item = inventario.find((x) => x.codigo === codigo);
    if (!item) return res.status(404).json({ mensaje: "El producto no existe en el inventario" });

    const { producto, costo, unidades } = req.body;
    if (producto !== undefined) item.producto = producto;
    if (costo !== undefined) item.costo = costo;
    if (unidades !== undefined) item.unidades = unidades;

    res.status(200).json(item);
});

servidor.delete("/inventario/:codigo", (req, res) => {
    const codigo = Number(req.params.codigo);
    const indice = inventario.findIndex((x) => x.codigo === codigo);
    if (indice === -1) return res.status(404).json({ mensaje: "El producto no existe en el inventario" });
    inventario.splice(indice, 1);
    res.status(204).end();
});

servidor.listen(3003, () => console.log("API de inventario activa en http://localhost:3003"));