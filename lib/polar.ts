import { Polar } from '@polar-sh/sdk';

export const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN || '',
    server: 'production', // User created account on main site, so default to production
});
