# 🐋 Cloudflare Chanfana OpenAPI Template with Docker Compose

This is a development setup with docker compose for the [Cloudflare OpenAPI Template](https://github.com/cloudflare/templates/tree/main/chanfana-openapi-template).

> [!TIP]
> While this example shows the Chanfana OpenAPI template, the principles on how to use Docker Compose can be applied for any other template as well.

## 🛠️ Prerequisites

* [Docker Compose](https://docs.docker.com/compose/install/)
* [Task (optional)](https://taskfile.dev/installation/)

## 📜 Usage

### First time

1. Copy `.env.example` to `.env` and `.env.dev.example` to `.env.dev`.

    ```shell
    task init
    ```
    
> [!NOTE]
> - The `.env.dev` file is used for development purposes, and can include variables/secrets like `CLOUDFLARE_API_TOKEN`, and will **not** be parsed for wrangler types.
> - The `.env` file is used for production purposes, and can include variables/secrets like `API_KEY`, that can be used for the application and will be parsed for wrangler types.

> [!IMPORTANT]
> By default, the `API_KEY` is set to `your-api-key` from the copied [`.env.example`](./.env.example), along with the `APP_ENV=development` environment variable. Make sure to add/update the `API_KEY` secret and `APP_ENV` variable to the worker when deploying to CloudFlare.

2. Install dependencies before starting the container.

    ```shell
    task npm:install
    ```

3. Start the container.

    ```shell
    task up
    ```
4. Access the UI at [`http://localhost:8788`](http://localhost:8788).

🚀 **TLDR**

Initialize the project, install dependencies, and start the container.

```shell
task setup
```

### 🐚 Additional commands

#### NPM 

##### Install

Install NPM dependencies.

```shell
task npm:install
```

##### Update

Update NPM dependencies.

```shell
task npm:update
```

#### Compose

##### Up

Start vite dev server.

```shell
task up
```

##### Down

Stop and remove the container.

```shell
task down
```

##### Logs

View container logs.

```shell
task logs
```

#### Wrangler

##### Types

Generate wrangler types.

```shell
task wrangler:types
```

##### Deploy

Deploy to Cloudflare Workers.

```shell
task wrangler:deploy
```

> [!IMPORTANT]  
> This requires the `CLOUDFLARE_API_TOKEN` to be set in the `.env` file.


> [!NOTE]
> This will automatically set the `APP_ENV` variable to `production`.

##### Secret

Upload secret.

```shell
task wrangler:secret s=<NAME_OF_SECRET>
# Example
task wrangler:secret s=API_KEY
```

> [!IMPORTANT]  
> - This requires the `CLOUDFLARE_API_TOKEN` to be set in the `.env` file.
> - You will be prompted to enter the secret value.

#### Biome

##### Format

Run biome format with safe fixes.

```shell
task biome:format:fix
```

##### Lint

Run biome lint with safe fixes.

```shell
task biome:lint:fix
```

##### Check

Run biome check with safe fixes.

```shell
task biome:check:fix
```

## 🧑‍🏫 Good to know

- The current development setup uses [Vite](https://vite.dev/) with the [`@cloudflare/vite-plugin`](https://www.npmjs.com/package/@cloudflare/vite-plugin).
  - You can also run the setup with just Wrangler (without Vite), but make sure you pass `--ip 0.0.0.0` to the `wrangler dev` command.
    ```shell
    wrangler dev --ip 0.0.0.0
    ```
    If you use `--host` instead of `--ip`, you will get an empty response when trying to acces the page!
- The base image for the docker compose worker service is `node:24-slim`.
- There is a Github action that releases a new version of the worker when pushed to `main` (or manual workflow dispatch).
  - The action uses `cloudflare/wrangler-action@v3` but has the `wranglerVersion` explicitly set to match the version in the `package.json` (v4).
  - By default, the [`release.yml`](.github/workflows/release.yml) has `WRANGLER_QUIET` set to `true` and `SHOW_DEPLOYMENT_URL` set to `false`, which will hide the deployment URL from the logs.
- This Chanfana OpenAPI example uses middleware applied to all routes (for fast setup of secure API endpoints).
  - Use the `x-api-key` header to authenticate requests, or use the "Authorize" button when using the UI with `API_KEY` value set in the `.env` file.

## 🛠️ Contribute

### Requirements

* ☑️ [Pre-commit](https://pre-commit.com/#installation).
* 📋 [Task (optional)](https://taskfile.dev/installation/)

### Usage

Run `pre-commit install` or `task precommit:install` to install the pre-commit hooks. 

You are now ready to contribute!

## ❕ Licence

This repository comes with a [MIT license](./LICENSE).
