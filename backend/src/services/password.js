import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt); // from callback to promise based implementation

export class Password {
  static async toHash(password) {
    const salt = randomBytes(8).toString("hex");
    const buf = await scryptAsync(password, salt, 64);

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword, suppliedPassword) {
    // TODO: check time safety here, i.e. if somebody can predict which is the password by how much it takes to process the request.

    const [hashedPassword, salt] = storedPassword.split(".");

    const buf = await scryptAsync(suppliedPassword, salt, 64);

    return buf.toString("hex") === hashedPassword;
  }
}
