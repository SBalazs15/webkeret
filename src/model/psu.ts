import { Product } from "./product";

export interface PSU extends Product {
  power:number,
  rate:string,
  noise: string,
  type:string,
  PFC:string,
  ventSize: number,
  maxIntake:Map<string, number>,
  tapKapcs: boolean,
  v110Kapcs: boolean,
  FDD:Map<boolean, number>,
  HDD:Map<boolean, number>,
  SATA:Map<boolean, number>,
  PCI_Expresss:Map<boolean, number>,
}
