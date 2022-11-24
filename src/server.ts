import { Application, oakCors, Router } from "./deps.ts";
import type { RouterContext } from "./deps.ts";
import { logger } from "./deps.ts";
import appRouter from "./routes/index.ts";
import NoteModel from "./models/note.model.ts";
import db from "./connectDB.ts";

db.link([NoteModel]);

const app = new Application();
const router = new Router();

// Middleware Logger
app.use(logger.default.logger);
app.use(logger.default.responseTime);

app.use(
  oakCors({
    origin: /^.+localhost:(3000|3001)$/,
    credentials: true,
  })
);

router.get<string>("/api/healthchecker", (ctx: RouterContext<string>) => {
  ctx.response.body = {
    status: "success",
    message: "Build a CRUD API with Deno and DenoDB",
  };
});

appRouter.init(app);
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ port, secure }) => {
  console.log(
    `🚀 Server started on ${secure ? "https://" : "http://"}localhost:${port}`
  );
});

const port = 8000;

await db.sync({ drop: true });
console.info("✅ Database connected...");
app.listen({ port });
