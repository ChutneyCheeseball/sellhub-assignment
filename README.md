# Sellhub Assignment

This is a [Turbo monorepo](https://turbo.build/repo/docs) created with `npx create-turbo@latest`.

## Repo contents

The repo contains three apps:

1. `api` - NodeJS microservice with Fastify and Drizzle
2. `dashboard` - NextJS app for managing product inventory
3. `store` - NextJS app for ordering products

Each repo has its own `README` file with specifics.

## Getting started

Execute `npm run dev` from the root of the repo to start all the apps simultaneously.

`api` runs on http://localhost:3002

`dashboard` runs on http://localhost:3000

`store` runs on http://localhost:3001

## PostgreSQL

The Postgres database is provided by [Neon](https://neon.tech) (running on AWS).

This eliminates the need for running and seeding a database on your local machine.
