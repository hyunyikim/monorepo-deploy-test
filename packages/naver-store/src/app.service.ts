import { Injectable } from "@nestjs/common";
import { arch, hostname, networkInterfaces, type, userInfo } from "os";

@Injectable()
export class AppService {
  getHello() {
    return {
      hostname: hostname(),
      mode: process.env.NODE_ENV,
      userInfo: process.env.NODE_ENV ? userInfo() : undefined,
      type: process.env.NODE_ENV ? type() : undefined,
      cpuArchitecture: process.env.NODE_ENV ? arch() : undefined,
      networkInterfaces: process.env.NODE_ENV ? networkInterfaces() : undefined,
      test: true,
    };
  }
}
