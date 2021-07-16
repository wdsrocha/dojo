/**
 * @type {import('next/dist/next-server/server/config-shared').NextConfig}
 */
const nextConfig = {
  typescript: {
    // TODO: find out why NextJS does't ignores cypress directory (but does
    // igore cypress/tsconfig.json). Because of this, the build was failling
    // with an error similar to what was being descripted in this [stack
    // overflow question](https://stackoverflow.com/q/56577201/7651928).
    // NextJS proposes the workaround fix to just ignore TS errors, as described
    // [here](https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors)
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
