import {Case} from './case';
import {MotherBoard} from './motherboard';
import {CPU} from './cpu';
import {Cooler} from './cooler';
import {RAM} from './ram';
import {GPU} from './gpu';
import {PSU} from './psu';

export interface Build{
  id: number;
  buildName: string;
  puBlic: boolean;
  uid: string;
  case: Case,
  motherboard: MotherBoard,
  cpu: CPU,
  cooler: Cooler,
  ram: RAM,
  gpu: GPU,
  psu: PSU,
}
