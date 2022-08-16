# kids-first-portal-ui

<p align="center">
  <img src="docs/portal.svg" alt="Kids First Portal" width="660px">
</p>

## Pre-requisites

- Node 16+
- Docker

## Get Started

### Environment variables:

- Create a `.env` with the scheme found here: https://github.com/include-dcc/include-portal-ui/blob/main/.env.schema
- Make sure to fill all the variables

### Running the project locally

#### Starting the Bastion

- Start bastion using: `igor`

#### Starting the project

- Install dependencies: `npm install`
- Start the project: `npm start`

### Running the USERS API locally

- Clone: https://github.com/include-dcc/include-users-api
- Follow the steps here: https://github.com/include-dcc/include-users-api/blob/main/README.md
- Make sure to add the include keycloak config for the users-api in your `.env`

### Branch

Namee structure is `type/SKFP-[github ticker number]/description`

e.g.

```
"fix/SKFP-23432/issue-with-..."

```

Supported types:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

### Commit

Commit message should follow a customized [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/)

Message structure is `type([scope]): #[github ticker number] message`

e.g.

```
"fix(CohortBuild): #23432 Resolve issue with ..."

"feat: #23423 Member can now do ..."
```

Supported types:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

## Deployment

See [Documentation](./docs/deployment.md)

## Acknowledgement

![BrowserStack](https://p14.zdusercontent.com/attachment/1015988/mVbXkllx1hWJdPCwDFvGRKTKN?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..rDbRduvjeVljoFINWeWs6g.RibPum74kZ-zVBICauqkiEHwcXhCom_liJ_jlcB-FMdSnxBFzRX1JuQiY7QHLkVOZMbJ0WTJt5EQC58AfAinrEjeG0mYw5jgMK_XJZr5BXNZGMchKIBqK6g8ExTiJQ5xUza-7A9dumNADrdNFcAhnIK3LLJ0wEFOkvZCBeagBVJnrE2nAtVu9Ih4HcQ2LNegwD_doHNKgC_9wN_IbuA3zNDQfVQrTMyhvymSLk-mSc-mXh14UNE8Yn5_YTaNcR9NgD8Yn14biHoH1Yz71EFmmKO9G17TXfnEEuH5EHGQsys.Cy8dep1Cq1viFeHCDmpBMg)
