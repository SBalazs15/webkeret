import { Product } from "./product.model";

export class PSU implements Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public category: string = "Tápegység",
    public power:number,
    public rate:string,
    public noise: string,
    public image: string
  ) { }
}
