export class UnauthorizedException extends Error {
  public status = 403

  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedException'
  }
}
