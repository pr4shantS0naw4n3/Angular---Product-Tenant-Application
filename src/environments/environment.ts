// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  apiUserLcl: 'http://localhost:8000/api/user/',
  apiPartnerLcl: 'http://localhost:8000/api/partner/',
  apiSSOLcl: 'http://localhost:8000/api/SSO/',
  // Tenant1
  apiUserEc2: 'http://52.208.218.183:8000/api/user/',
  apiPartnerEc2: 'http://52.208.218.183:8000/api/partner/',
  apiSSOEc2: 'http://52.208.218.183:8000/api/SSO/',
  // Tenant2
  apiUserT2: 'http://52.208.218.183:1111/api/user/',
  apiPartnerT2: 'http://52.208.218.183:1111/api/partner/',
  apiSSOT2: 'http://52.208.218.183:1111/api/SSO/',
};
