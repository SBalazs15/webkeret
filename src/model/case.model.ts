import { Product } from "./product.model";

export class Case implements Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public category: string = "Gépház",
    public dimensions:number[],
    public ventCount:number,
    public ventSizes: number[],
    public motherBoardSizes: string[],
    public image: string

  ) { }
}
