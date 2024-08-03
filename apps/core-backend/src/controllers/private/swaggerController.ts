import { Get, Route, Tags, Response } from "tsoa";
import swaggerUi from "swagger-ui-express";
import * as express from "express";
import * as swaggerDocument from "../../generated/private/swagger.json";

@Route("docs")
@Tags("Documentation")
export class SwaggerController {
  @Get("/")
  @Response<void>(200, "Success")
  public async getSwaggerUI(): Promise<string> {
    return swaggerUi.generateHTML(swaggerDocument);
  }

  // This method will be used to set up the actual route in your Express app
  public static setupSwaggerRoute(app: express.Application): void {
    app.get(
      "/api/internal/v1/docs",
      (req: express.Request, res: express.Response) => {
        new SwaggerController()
          .getSwaggerUI()
          .then((html) => res.send(html))
          .catch((error) =>
            res.status(500).json({ error: "Failed to generate Swagger UI" })
          );
      }
    );
  }
}
