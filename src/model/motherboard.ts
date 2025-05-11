import { Product } from "./product";

export interface MotherBoard extends Product {
    socket:string,
    chipset: string,
    isServer: boolean,
    maxMemori: number,
    memoriSockets: number,
    memoriType:string,
    sataCount: number,
    wifi:boolean,
    bluetooth: boolean,
    ports:Map<string,number>,
    isHdmi: boolean,
    isDisplayPort: boolean,
    USBPortCount:number,
    isHangKartya: boolean,
    meret:string,
    size:string,
    m2count:number,
}
