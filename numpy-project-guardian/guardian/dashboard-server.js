
import http from "http";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guardianRoot =
  path.resolve(__dirname, "..");

const dashboardRoot =
  path.join(
    guardianRoot,
    "dashboard"
  );

const PORT = 4170;


const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};


function send(
  response,
  status,
  body,
  contentType = "text/plain; charset=utf-8"
) {

  response.writeHead(
    status,
    {
      "Content-Type": contentType
    }
  );

  response.end(body);
}


function runGuardian() {

  return new Promise((resolve) => {

    const guardianProcess =
      spawn(
        process.execPath,
        [
          path.join(
            guardianRoot,
            "guardian",
            "run.js"
          )
        ],
        {
          cwd: guardianRoot,
          shell: false
        }
      );


    let output = "";


    guardianProcess.stdout.on(
      "data",
      data => {

        output +=
          data.toString();

      }
    );


    guardianProcess.stderr.on(
      "data",
      data => {

        output +=
          data.toString();

      }
    );


    guardianProcess.on(
      "close",
      code => {

        resolve({
          exitCode:
            code ?? 1,

          output
        });

      }
    );

  });

}


const server =
  http.createServer(
    async (request, response) => {

      const url =
        new URL(
          request.url,
          `http://localhost:${PORT}`
        );


      // ----------------------------------------
      // Guardian API
      // ----------------------------------------

      if (
        url.pathname === "/api/run" &&
        request.method === "POST"
      ) {

        const result =
          await runGuardian();


        send(
          response,
          200,
          JSON.stringify(result),
          "application/json; charset=utf-8"
        );

        return;
      }


      // ----------------------------------------
      // Dashboard
      // ----------------------------------------

      let requestedPath =
        url.pathname === "/"
          ? "index.html"
          : url.pathname.substring(1);


      const filePath =
        path.join(
          dashboardRoot,
          requestedPath
        );


      // Security: prevent directory traversal
      if (
        !filePath.startsWith(
          dashboardRoot
        )
      ) {

        send(
          response,
          403,
          "Forbidden"
        );

        return;
      }


      if (
        !fs.existsSync(filePath) ||
        !fs.statSync(filePath).isFile()
      ) {

        send(
          response,
          404,
          "Not Found"
        );

        return;
      }


      const extension =
        path.extname(filePath);

      const contentType =
        mimeTypes[extension] ||
        "application/octet-stream";


      send(
        response,
        200,
        fs.readFileSync(filePath),
        contentType
      );

    }
  );


server.listen(
  PORT,
  "127.0.0.1",
  () => {

    console.log("");
    console.log(
      "🛡️ NUMPY PROJECT GUARDIAN"
    );

    console.log(
      "Guardian Dashboard"
    );

    console.log(
      "────────────────────────────────"
    );

    console.log(
      `Dashboard: http://localhost:${PORT}`
    );

    console.log("");
    console.log(
      "Press Ctrl+C to stop."
    );

    console.log("");

  }
);
