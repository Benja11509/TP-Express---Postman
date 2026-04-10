import express from "express";
import cors from "cors";

import Alumno from "./src/models/Alumno.js";
import { sumar, restar, multiplicar, dividir } from "./src/modules/matematica.js";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./src/modules/omdb-wrapper.js.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("¡Ya estoy respondiendo!");
});

// a2
app.get("/saludar/:nombre", (req, res) => {
  const { nombre } = req.params;
  res.status(200).send(`Hola ${nombre}`);
});

// a3
app.get("/validarfecha/:ano/:mes/:dia", (req, res) => {
  const { ano, mes, dia } = req.params;

  const fecha = `${ano}-${mes}-${dia}`;
  const esValida = !isNaN(Date.parse(fecha));

  if (esValida) {
    res.status(200).send("Fecha válida");
  } else {
    res.status(400).send("Fecha inválida");
  }
});
const getNums = (req) => {
  return {
    n1: Number(req.query.n1),
    n2: Number(req.query.n2),
  };
};

app.get("/matematica/sumar", (req, res) => {
  const { n1, n2 } = getNums(req);
  res.status(200).json({ resultado: sumar(n1, n2) });
});

app.get("/matematica/restar", (req, res) => {
  const { n1, n2 } = getNums(req);
  res.status(200).json({ resultado: restar(n1, n2) });
});

app.get("/matematica/multiplicar", (req, res) => {
  const { n1, n2 } = getNums(req);
  res.status(200).json({ resultado: multiplicar(n1, n2) });
});

app.get("/matematica/dividir", (req, res) => {
  const { n1, n2 } = getNums(req);

  if (n2 === 0) {
    return res.status(400).send("El divisor no puede ser cero");
  }

  res.status(200).json({ resultado: dividir(n1, n2) });
});

const armarRespuesta = (datos) => {
  return {
    respuesta: datos && (Array.isArray(datos) ? datos.length > 0 : true),
    cantidadTotal: Array.isArray(datos) ? datos.length : (datos ? 1 : 0),
    datos: datos || (Array.isArray(datos) ? [] : {})
  };
};

// c1
app.get("/omdb/searchbypage", async (req, res) => {
  const { search, p } = req.query;

  const data = await OMDBSearchByPage(search, p);
  res.status(200).json(armarRespuesta(data));
});

// c2
app.get("/omdb/searchcomplete", async (req, res) => {
  const { search } = req.query;

  const data = await OMDBSearchComplete(search);
  res.status(200).json(armarRespuesta(data));
});

// c3
app.get("/omdb/getbyomdbid", async (req, res) => {
  const { imdbID } = req.query;

  const data = await OMDBGetByImdbID(imdbID);
  res.status(200).json(armarRespuesta(data));
});

const alumnosArray = [];

alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

// d1
app.get("/alumnos", (req, res) => {
  res.status(200).json(alumnosArray);
});

// d2
app.get("/alumnos/:dni", (req, res) => {
  const { dni } = req.params;

  const alumno = alumnosArray.find(a => a.dni === dni);

  if (alumno) {
    res.status(200).json(alumno);
  } else {
    res.status(404).send("Alumno no encontrado");
  }
});

// d3
app.post("/alumnos", (req, res) => {
  const { username, dni, edad } = req.body;

  const nuevoAlumno = new Alumno(username, dni, edad);
  alumnosArray.push(nuevoAlumno);

  res.status(201).send("Alumno creado");
});

// d4
app.delete("/alumnos", (req, res) => {
  const { dni } = req.body;

  const index = alumnosArray.findIndex(a => a.dni === dni);

  if (index !== -1) {
    alumnosArray.splice(index, 1);
    res.status(200).send("Alumno eliminado");
  } else {
    res.status(404).send("Alumno no encontrado");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});