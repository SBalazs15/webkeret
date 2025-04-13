export class User {
  constructor(
    public name: string,
    public username: string,
    public birthDate: string,
    public email: string,
    public pw: string
  ) { }

  toString(): string {
    return "A felhasználó neve: " + this.name+"\n a felhasználó userneve: " + this.username+"\n a felhasználó születési éve: " + this.birthDate+"\n a felhasználó email-je: " + this.email+"\n a felhasználó jelszava: " + this.pw;
  }
}
