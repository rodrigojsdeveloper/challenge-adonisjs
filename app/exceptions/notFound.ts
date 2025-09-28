export class NotFoundException extends Error {
  public status = 404;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
  }
}
