// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  apiUserLcl: 'http://localhost:8000/api/user/',
  apiPartnerLcl: 'http://localhost:8000/api/partner/',
  apiSSOLcl: 'http://localhost:8000/api/SSO/',

  apiUserEc2: 'http://52.208.218.183:8000/api/user/',
  apiPartnerEc2: 'http://52.208.218.183:8000/api/partner/',
  apiSSOEc2: 'http://localhost:8000/api/SSO/',
};
