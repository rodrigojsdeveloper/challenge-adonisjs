export class UnauthorizedException extends Error {
  public status = 401

  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedException'
  }
}
