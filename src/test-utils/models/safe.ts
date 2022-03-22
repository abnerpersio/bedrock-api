import { Safe } from '../../app/models';
import { defaultSafe } from '../fixtures/safe';

export const mockSafeModel = () => {
  Safe.find = jest.fn().mockResolvedValue([new Safe(defaultSafe)]);
  Safe.findById = jest.fn().mockResolvedValue(new Safe(defaultSafe));
  Safe.findOne = jest.fn().mockResolvedValue(new Safe(defaultSafe));
  Safe.create = jest.fn().mockResolvedValue(new Safe(defaultSafe));
  Safe.findOneAndDelete = jest.fn().mockResolvedValue(true);
  Safe.findOneAndUpdate = jest
    .fn()
    .mockResolvedValue(new Safe({ ...defaultSafe, name: defaultSafe.updatedName }));
};
