import { Product } from "./product.model";

export class MotherBoard implements Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public category: string = "Alaplap",
    public socket:string,
    public maxMemori: number,
    public wifi:boolean,
    public bluetooth: boolean,
    public ports:Map<string,number>,
    public image: string

  ) { }
}
