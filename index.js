import express from "express";
import { engine } from "express-handlebars";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = import.meta.dirname;

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

// 404 para cualquier otra ruta
app.get("*", (_, res) => {
  return res.status(404).render("404", { title: "No se encuentra la página" });
});

app.listen(PORT, () =>
  console.log("Servidor funcionando en http://localhost:" + PORT)
);
