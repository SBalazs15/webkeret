import { Product } from "./product";

export interface CPU extends Product {
    cores: number,
    thread: number,
    TDP: number,
    socket: string,
    cache: Map<string,number>,
    clockSpeed: number,
    turboClockSpeed: number,
    integratedGPU: string,
}
