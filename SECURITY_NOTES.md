# Security Notes

## Vulnerabilities in Dev Dependencies

The `npm audit` command reports vulnerabilities in development dependencies, specifically in the `vercel` CLI package. These vulnerabilities **do NOT affect production** because:

1. ✅ **Production audit is clean**: Running `npm audit --production` shows **0 vulnerabilities**
2. ✅ **Dev-only dependencies**: The vulnerabilities are in `vercel` CLI, which is only used for local development
3. ✅ **Not bundled**: These packages are not included in production builds

### Vulnerabilities Reported

- `esbuild <=0.24.2` - Moderate severity (in vercel CLI dependencies)
- `path-to-regexp 4.0.0 - 6.2.2` - High severity (in vercel CLI dependencies)
- `undici <=5.28.5` - Moderate severity (in vercel CLI dependencies)

### Why We're Not Fixing Them

The `npm audit fix --force` command suggests downgrading `vercel` from `49.1.1` to `25.2.0`, which would:
- ❌ Remove newer features and bug fixes
- ❌ Potentially break compatibility with newer Vercel features
- ❌ Not improve production security (these are dev-only)

### Recommendation

These vulnerabilities can be safely ignored because:
- They only affect the local development CLI tool
- Production builds are not affected
- The Vercel deployment platform handles its own security

If you want to suppress these warnings, the `.npmrc` file is configured to only show moderate+ severity issues in production dependencies.
