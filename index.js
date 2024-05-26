import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { nanoid } from "nanoid";
import { writeFile, readFile } from "fs/promises";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

const pathFile = __dirname + "/data/deportes.json";

// public directory
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/jquery/dist"))
);

// Middlewares body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/desafio", async (req, res) => {
  res.render("desafio");
});

app.get("/deportes", async (req, res) => {
  try {
    const stringDeportes = await readFile(pathFile, "utf-8");
    const deportes = JSON.parse(stringDeportes);

    return res.json({ deportes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false });
  }
});

app.get("/agregar", async (req, res) => {
  let mensaje = "";

  try {
    const { nombre, precio } = req.query;

    const newDeporte = {
      id: nanoid(10),
      deporte: nombre,
      precio,
    };

    const stringDeportes = await readFile(pathFile, "utf-8");
    const deportes = JSON.parse(stringDeportes);

    deportes.push(newDeporte);

    await writeFile(pathFile, JSON.stringify(deportes));

    return res.json({ ok: newDeporte });
  } catch (error) {
    mensaje = "No fue posible crear el registro";
    console.log(error);
    res.render("desafio", { mensaje, error });
  }
});

app.get("/editar", async (req, res) => {
  let mensaje = "";

  try {
    const {  precio, id } = req.query;

    const stringDeportes = await readFile(pathFile, "utf-8");
    const deportes = JSON.parse(stringDeportes);

    const deporte = deportes.find((item) => item.id === id);

    if (!deporte) {
      return res.status(404).json({ ok: false, msg: "Deporte no encontrado" });
    }

    deporte.precio = precio;
   
    await writeFile(pathFile, JSON.stringify(deportes));
    return res.json({ deportes });

  } catch (error) {
    mensaje = "No fue posible crear el registro";
    console.log(error);
    res.render("desafio", { mensaje, error });
  }
});

// 404 para cualquier otra ruta
app.get("*", (_, res) => {
  return res.status(404).render("404", { title: "No se encuentra la página" });
});

app.listen(PORT, () =>
  console.log("Servidor funcionando en http://localhost:" + PORT)
);
