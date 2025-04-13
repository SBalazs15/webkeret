import { Product } from "./product.model";

export class GPU implements Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public category: string = "Videókártya",
    public cuda:number,
    public speed: number,
    public memori: number,
    public tdp:number,
    public image: string
  ) { }
}
