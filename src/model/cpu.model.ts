import { Product } from "./product.model";

export class CPU implements Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public category: string = "Processzor",
    public cores: number,
    public TDP: number,
    public socket: string,
    public cache: Map<string,number>,
    public clockSpeedGhz: number = 3.5,
    public image: string

  ) { }
}
