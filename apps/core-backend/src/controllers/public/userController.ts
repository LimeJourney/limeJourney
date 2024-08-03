import { Controller, Get, Path, Route } from "tsoa";

@Route("users")
export class UserController extends Controller {
  @Get("{userId}")
  public async getUser(@Path() userId: number): Promise<any> {
    return { id: userId, name: "John Doe" };
  }
}
