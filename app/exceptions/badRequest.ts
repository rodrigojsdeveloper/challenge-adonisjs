export class BadRequestException extends Error {
  public status = 400;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestException";
  }
}
