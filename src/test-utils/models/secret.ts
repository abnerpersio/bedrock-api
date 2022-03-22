import { Secret } from '../../app/models';
import { defaultSecret } from '../fixtures/secret';

export const mockSecretModel = () => {
  Secret.find = jest.fn().mockResolvedValue([new Secret(defaultSecret)]);
  Secret.findById = jest.fn().mockResolvedValue(new Secret(defaultSecret));
  Secret.findOne = jest.fn().mockResolvedValue(new Secret(defaultSecret));
  Secret.create = jest.fn().mockResolvedValue(new Secret(defaultSecret));
  Secret.findOneAndDelete = jest.fn().mockResolvedValue(true);
  Secret.findOneAndUpdate = jest.fn().mockResolvedValue(
    new Secret({
      ...defaultSecret,
      name: defaultSecret.updatedName,
      secret: defaultSecret.updatedSecret,
    }),
  );
};
