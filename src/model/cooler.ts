import { Product } from "./product";

export interface Cooler extends Product {
  ventSize:string,
  ventSpeed:string,
  maxNoise:string,
  airFlow:string,
  LED: boolean,
  size:string,
  socket: string[],
  wieght:number,
  TDP: number,
  type:string,
}
