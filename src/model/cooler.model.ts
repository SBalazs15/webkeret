import { Product } from "./product.model";

export class Cooler implements Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public category: string = "Hűtő",
    public size:number,
    public socket: string,
    public TDP: number,
    public image: string

  ) { }
}
