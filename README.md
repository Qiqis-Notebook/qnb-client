# Qiqi's Notebok Desktop Client

<div align="center">
  <img src="./assets/logo.png" style="width: 256px; height: 256px;" />
</div>

A dekstop application for [Qiqi's Notebook](https://www.qiqis-notebook.com) to launch routes on an 'always on top' window to see and control the route map while playing Genshin Impact or Wuthering Waves.

The application supports keyboard shortcuts for navigation. All the functionalities works the same as the web version, panning, zooming, etc.

This application is designed to be use with Genshin/WuWa in windowed mode.

> Note: WuWa has a runaway cursor issue, it is recommended to place your route window away from the horizontal center of your screen to avoid this.

## Usage

To search for routes, go to "Search" tab under "Routes" on the navigation menu and to browse all publicly shared routes. For a better searching experience, go to our [website](https://www.qiqis-notebook.com/database/routes) to search instead.
Alternatively, you can paste a route ID or link directly into the search bar to open the route.

Once you have a route, you can open it to reposition the route window to your liking and start following the route.

> Go to the "Settings" page (Cog button at the bottom of the menu) to customize your application behavior.

## Controls

Keybinds for route navigation can be modified in the settings menu.

### Default keybinds

- Alt + Left Arrow: Previous marker
- Alt + Right Arrow: Next marker

> Hint: Bind the controls onto your mouse/macro keys for quick access

## App

### Stack

The application is built with:

- Electron
- Electron Forge: Package and Distribution
- React: Frontend framework
- TailwindCSS: CSS Framework
- Daisy UI: Tailwind CSS Components
- Webpack: Bundler

The route execution path is as follow:

1. Fetches route details from Qiqi's Notebook API
2. Pass the route link to Electron main process through IPC
3. Opens a new browser window and loads the route link
4. Set the window properties
5. Register keyboard shortcuts

When the keyboard shortcut event is fired, it grabs the navigation button through the DOM and click it.

## Build

> Requires [Node.js](https://nodejs.org/en)

To build the application, run:

```
npm i
npm run make
```

The application is packaged by 'electron-forge' and will be in the 'out' folder.

## Develop

To develop the application, install and start the electron app.

```
npm i
npm start
```

> There is no mock API server so all fetch requests to the local Qiqi's Notebook API endpoint will fail. You can mock the API response based on the type definition but limit the use of production API (from qiqis-notebook.com) to develop as it can result in Cloudflare Ban.

> API url can be configured in `config/constants.ts`, the default development api url is `http://127.0.0.1:3001`

## FAQ

**Can I be banned using this?**

- As with any third party applications, you are to use at your own risk. The application does not interact with your game in anyway so the risk of such event happening should be highly unlikely. The application is also open-sourced such that you can inspect what the application is doing.

**Application/installer is flagged by anit-virus**

- The application is not 'Code Signed' thus the operating system may flag it as unsafe. If you have safety concerns, you can compile the application yourself by following the build step above.

**"Installation has failed"**

- There are many reasons that can cause installation to fail, more commonly due to anti-virus blocking the installation procedure for the reason listed above. You can join our [discord](https://discord.gg/xyddRPYSdD) for us to help you troubleshoot and we also have a link to the .zip for the unpacked application there.

**The route window is too big**

- Our application requires a minimum size of 350x350 px to function properly, if your display has screen scaling (for larger screen resolution), you can toggle the "Compensate Scaling" option in settings to override the native OS application scaling.

# Asset

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">Qiqi's Notebook Logo</span> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.instagram.com/merdikai/">Beya</a> is owned by the Qiqi's Notebook project and licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a></p>
