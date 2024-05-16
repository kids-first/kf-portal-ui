# Deployment

:warning: Communicate on #portal-leads slack channel to make sure there are no blockers to deploy (presentation, demo, etc)

## PROD

Checkout dev branch and make sure you are up to date

### Release Note

1. Bump version in package.json and package-lock.json

2. Update RELEASES.md with release notes (ask the Product Owner)

3. Commit and push directly on dev

### Deploy to PROD

1. Checkout main branch and make sure you are up to date and your dev branch is up to date

2. Run `git merge dev --no-commit`

3. Push directly on main

4. Go to [Netlify](https://app.netlify.com/sites/prod-kidsfirst-portal/overview) and make sure the deployment is successful 

5. In [Github Compare](https://github.com/kids-first/kf-portal-ui/compare) make sure dev and main branch are sync (no change between them)

6. In [Github Releases](https://github.com/kids-first/kf-portal-ui/releases) draft a new release with the version and the content used in RELEASES.md, make sure to target main branch

7. Move JIRA tickets in Ready to Deploy to Done

8. Do a quick check on the [Portal](https://portal.kidsfirstdrc.org/) to make sure everything works

