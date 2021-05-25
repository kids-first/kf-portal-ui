# Deployment

## Production

### Create the Release

- Checkout dev

  ```sh
  git fetch --all
  git checkout dev
  git reset --hard origin/dev
  ```

- Create new release

  1. Update the NEWS.md file listing the changes from the last release
  2. Bump the version in package.json [using semantic version](https://semver.org/)
  3. Create a version commit with the following messages : `Release [VERSION]`

     e.g.

     ```sh
     git commit -m "Release 3.1.5" --no-verify
     ```

  4. Push on origin
     ```sh
     git push origin/master
     ```

- Create PR against `master`

### When the PR Is merged on master

- Checkout master

  ```sh
  git fetch --all
  git checkout master
  git reset --hard origin/master
  ```

- Create a tag
  ```sh
  git tag [VERSION]
  git push [VERSION]
  ```
