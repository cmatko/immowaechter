export const generateTestUser = () => {
  const timestamp = Date.now();
  return {
    email: `test.user.${timestamp}@example.com`,
    password: 'Test123!@#',
  };
};

export const generateTestProperty = () => {
  const timestamp = Date.now();
  return {
    name: `Test Haus ${timestamp}`,
    address: 'Teststraße 123',
    postal_code: '1010',
    city: 'Wien',
    country: 'AT',
    property_type: 'house',
    build_year: 2020,
    living_area: 150.5,
  };
};