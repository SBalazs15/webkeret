import { Product } from "./product";

export interface RAM extends Product {
  speed: number,
  memorySize: number,
  package: string,
  type:string,
  kesleltetes:string,
  hutoborda:boolean,
  LED:boolean,
  voltage:number,
}
