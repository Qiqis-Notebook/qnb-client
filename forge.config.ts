import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

import { DEV_URL, PROD_URL } from "./config/constants";

import "dotenv/config";

const configParams = {
  id: "QiqisNotebook",
  name: "Qiqi's Notebook",
  installerName: "Qiqi's Notebook Installer",
  iconUrl: "https://www.qiqis-notebook.com/icon.ico",
  iconRelative: "./assets/icons/icon.ico",
  homepage: "https://qiqis-notebook.com",
};

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "./assets/icons/icon",
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      // name: configParams.id,
      // title: configParams.name,
      // setupExe: configParams.installerName,
      // setupMsi: configParams.installerName,
      iconUrl: configParams.iconUrl,
      setupIcon: configParams.iconRelative,
    }),
    new MakerDMG(
      {
        name: configParams.name,
        icon: configParams.iconRelative,
        overwrite: true,
      },
      []
    ),
    new MakerZIP({}, []),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: `default-src 'self' ${DEV_URL} ${PROD_URL} https://cdn.discordapp.com 'unsafe-eval' 'unsafe-inline'`,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/renderer/index.html",
            js: "./src/renderer/index.tsx",
            name: "main_window",
            preload: {
              js: "./src/main/preload.ts",
            },
          },
        ],
      },
      port: 3005,
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "Qiqis-Notebook",
          name: "qnb-client",
        },
        draft: true,
        authToken: process.env.GITHUB_TOKEN,
      },
    },
  ],
};

export default config;
