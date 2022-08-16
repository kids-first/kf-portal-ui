# include-portal-ui

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