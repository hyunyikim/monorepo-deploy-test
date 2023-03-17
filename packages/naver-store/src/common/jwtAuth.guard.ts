import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  BadRequestException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";

interface ITokenPayload {
  idx: number;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;
    if (!auth) {
      return false;
    }

    const token = auth.replaceAll("Bearer ", "");
    req["token"] = token;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return this.jwtService
      .verifyAsync<ITokenPayload>(token)
      .then((payload: ITokenPayload) => {
        req["partnerIdx"] = payload.idx;
        return true;
      })
      .catch((e) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        throw new Error("Invalid Token", { cause: e });
      });
  }
}

@Injectable()
export class MasterAuthGuard implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const header = req.headers.authorization;
    if (!header) {
      return false;
    }

    const token = header.replaceAll("Bearer ", "");
    req["token"] = token;
    return this.jwtService
      .verifyAsync(token)
      .then((payload: { idx: number; type: string }) => {
        return payload.type === "M";
      })
      .catch((error) => {
        throw new BadRequestException("Invalid Token");
      });
  }
}
