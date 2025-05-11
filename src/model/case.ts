import { Product } from "./product";

export interface Case extends Product {
    szelesseg: number,
    magassag: number,
    melyeg: number,
    suly: number,
    ventCount:number,
    ventSizes: number[],
    motherBoardSizes: string[],
    image: string
    USBcount: number,
}
