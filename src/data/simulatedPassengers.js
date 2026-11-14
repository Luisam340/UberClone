import { fakerES as faker } from '@faker-js/faker';

export function generateSimulatedPassenger() {
  const gender = faker.person.sexType();

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName({ sex: gender }),
    rating: faker.number.float({
      min: 4.5,
      max: 5,
      fractionDigits: 1,
    }),
    passengerCount: faker.number.int({
      min: 1,
      max: 4,
    }),
  };
}
