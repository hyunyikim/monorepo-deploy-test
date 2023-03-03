import { Controller, Post, Get } from "@nestjs/common";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("token")
  createToken() {
    return this.authService.createToken();
  }

  @Get("token")
  getToken() {
    return this.authService.getToken();
  }
}
