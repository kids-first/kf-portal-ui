# Deployment

:warning: Communicate on #portal-leads slack channel to make sure there are no blockers to deploy (presentation, demo, etc)

## Legacy PRD

Checkout dev branch and make sure you are up to date

### Release Note

1. Bump version in package.json and package-lock.json

2. Update RELEASES.md with release notes (ask the Product Owner)

3. Commit and push directly on dev

### Deploy to Legacy PRD

1. Checkout master branch and make sure you are up to date and your dev branch is up to date

2. Run `git merge dev --no-commit`

3. Push directly on master

4. Go to [Netlify](https://app.netlify.com/sites/prod-kidsfirst-portal/overview) and make sure the deployment is successful 

5. In [Github Compare](https://github.com/kids-first/kf-portal-ui/compare) make sure dev and master branch are sync (no change between them)

6. In [Github Releases](https://github.com/kids-first/kf-portal-ui/releases) draft a new release with the version and the content used in RELEASES.md, make sure to target master branch

7. Move JIRA tickets in Ready to Deploy to Done

8. Do a quick check on the [Legacy Portal](https://portal.kidsfirstdrc.org/) to make sure everything works

## Beta PRD

Checkout 2.0 branch and make sure you are up to date

### Release Note

1. Bump version in package.json and package-lock.json

2. Update RELEASES.md with release notes (ask the Product Owner)

3. Commit and push directly on 2.0

### Deploy to Beta PRD

1. Checkout Beta-Prd branch and make sure you are up to date and your 2.0 branch is up to date

2. Run `git merge 2.0 --no-commit`

3. Push directly on Beta-Prd

4. Go to [Netlify](https://app.netlify.com/sites/portal-pre-prod-kidsfirstdrc/overview) and make sure the deployment is successful 

5. In [Github Compare](https://github.com/kids-first/kf-portal-ui/compare) make sure 2.0 and Beta-Prd branch are sync (no change between them)

6. In [Github Releases](https://github.com/kids-first/kf-portal-ui/releases) draft a new release with the version and the content used in RELEASES.md, make sure to target Beta-Prd branch

7. Move JIRA tickets in Ready to Deploy to Done

8. Do a quick check on the [Beta Portal](https://portal-beta.kidsfirstdrc.org/) to make sure everything works
