export const environment = {
  production: true,
  // apiUrl: 'https://shelfwise-backend-05e96e925358.herokuapp.com',
  apiUrl:
    (window as any)['env']['NG_APP_API_URL'] ||
    'https://shelfwise-backend-05e96e925358.herokuapp.com',
};
