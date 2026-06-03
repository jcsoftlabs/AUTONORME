import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale: _locale}) => {
  return {
    messages: (await import(`../messages/fr.json`)).default
  };
});
