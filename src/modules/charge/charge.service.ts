import { ICharge, IChargeDoc } from './charge.interfaces';
import Charge from './charge.model';

export const createCharge = async (body: ICharge): Promise<IChargeDoc> => {
  return Charge.create(body);
};

export const getCharge = async (): Promise<IChargeDoc | null> => Charge.findOne({});
