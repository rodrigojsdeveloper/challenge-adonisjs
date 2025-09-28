export class UnprocessableEntityException extends Error {
  public status = 422;

  constructor(message: string) {
    super(message);
    this.name = "UnprocessableEntityException";
  }
}
