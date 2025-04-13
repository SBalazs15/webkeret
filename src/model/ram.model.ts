import { Product } from "./product.model";

export class RAM implements Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public category: string = "RAM",
    public speed: number,
    public memorySize: number,
    public type:string,
    public TDP: number,
    public image: string

  ) { }
}
