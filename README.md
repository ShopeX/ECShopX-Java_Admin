<p align="center"><img width="600" height="auto" alt="logo2" src="logo.png" /></p>

### <p align="center">Admin Frontend</p>

# Getting started
Node.js (current LTS) and pnpm are required to run the project. Enable Node's corepack so the declared pnpm version is used.

### System Requirements
Required Node.js Version: 22.23.4. If your current version differs, follow the steps below to switch
```
nvm install 22.23.4
nvm use 22.23.4
```

Or from the project root: `nvm use` (reads [`.nvmrc`](.nvmrc)). Then enable Corepack and install with the lockfile:

```
corepack enable
pnpm install --frozen-lockfile
```

Docker / CI builds use Node `22.23.4` and pnpm `10.13.0` ([`Dockerfile`](Dockerfile), `node-python3:22.23.4-alpine3.20`).

### Configure the .env file
```shell
# The system’s default settings do not require any changes.
VUE_APP_IS_SAAS=false

# Backend API Base URL
VUE_APP_BASE_API=

# The system’s default settings do not require any changes.
VUE_APP_PUBLIC_PATH=/

# The system’s default settings do not require any changes.
VUE_APP_WXIMG_URL=

# The system’s default settings do not require any changes.
VUE_APP_WXAUTHCALL_Url=

# The system’s default settings do not require any changes.
VUE_APP_QIANKUN_ENTRY=/newpc

# Media files OSS Server URL
VUE_APP_OSS_CDN=

# Map Service API Key，Used to configure offline store locations and retrieve store coordinates based on geographic information.
VUE_APP_MAP_KEY=

# Configurations for Hourly Delivery
VUE_APP_LOCAL_DELIVERY_DIRVER=

# Default Language Version（Chinese:zhcn/English:en)
VUE_APP_DEFAULT_LANG=en
```

### Cloud Deployment: Backend API Base URL

When deploying to a server or cloud host, login fails until `VUE_APP_BASE_API` points at your **own** backend instead of the default.

- **Which variable / file?** Set `VUE_APP_BASE_API` in `.env`, or in `.env.local` which overrides `.env` and is git-ignored (recommended for per-deployment values). If it is left empty the app falls back to `/`, so API calls hit the frontend host itself and login fails.
- **Do I need the port?** Only when the backend is reached directly on a non-standard port — the PHP API listens on `8005` by default. Behind a domain proxied by Nginx on 80/443, omit the port.
- **Rebuild after every change.** `VUE_APP_*` variables are baked into the static bundle at build time. After editing the env file you must re-run the build for the new address to take effect. Run the build from the project root (where `package.json` lives); inside a container, run it in that same directory.

```shell
# Behind a domain (Nginx on 80/443) — no port needed, end with /api
VUE_APP_BASE_API=https://your-domain.com/api
# Direct public IP on a non-standard port — include the port
VUE_APP_BASE_API=http://1.2.3.4:8005/api

# Rebuild after changing the value
pnpm run build:b2c   # B2C
pnpm run build:bbc   # B2B2C
```

### Installation
```
cd ECShopX_admin-frontend
corepack enable
pnpm install --frozen-lockfile
```

### Run project
```shell
# B2C Business Model
pnpm run dev:b2c
  
# B2B2C Business Model
pnpm run dev:bbc
```

### Build packages
```shell
# B2C Business Model
pnpm run build:b2c
  
# B2B2C Business Model
pnpm run build:bbc
```

## License
Each ECShopX source file included in this distribution is licensed under the Apache License 2.0, together with the additional terms imposed by ShopeX.

Open Software License (Apache 2.0) – Please see LICENSE.txt for the full text of the Apache 2.0 license.

每个包含在本发行版中的 ECShopX 源文件，均依据 Apache 2.0 开源许可证与ShopeX商派附加条款进行授权。

开源软件许可协议（Apache 2.0） —— 请参阅 LICENSE.txt 文件以获取 Apache 2.0 协议的完整文本。
