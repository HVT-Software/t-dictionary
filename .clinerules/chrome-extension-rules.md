## Brief overview

This Cline rule file outlines guidelines for developing Chrome extensions using React, TypeScript, and Vite, based on the chrome-extension-boilerplate-react-vite project structure and best practices.

## Project context

*   The project is a Chrome extension built using TypeScript, React, and Vite.
*   The project uses pnpm for package management.
*   The project uses turbo.json for monorepo management.
*   The project utilizes multiple `pages` for different extension contexts:
    *   `content` - content scripts (`content_scripts` in manifest.json)
    *   `content-ui` - React UI rendered in the current page (you can see it at the very bottom when you get started) (`content_scripts` in manifest.json)
    *   `content-runtime` - injected content scripts; this can be injected from popup like standard content
    *   `devtools` - extend the browser DevTools (`devtools_page` in manifest.json)
    *   `devtools-panel` - DevTools panel for devtools
    *   `new-tab` - override the default New Tab page (`chrome_url_overrides.newtab` in manifest.json)
    *   `options` - options page (`options_page` in manifest.json)
    *   `popup` - popup shown when clicking the extension in the toolbar (`action.default_popup` in manifest.json)
    *   `side-panel` - sidepanel (Chrome 114+) (`side_panel.default_path` in manifest.json)

## Development workflow

*   Use `pnpm install` to install dependencies.
*   Use `pnpm run dev` to start the development server.
*   Use `pnpm run build` to build the project.
*   Use `bash-scripts/copy_env.sh` to copy environment variables.
*   Use `bash-scripts/update_version.sh` to update the project version.

## Coding best practices

*   Use TypeScript for all code.
*   Use React for the user interface.
*   Use Vite for the build process.
*   Follow the project's existing coding style.
*   Use eslint for linting.
*   Use prettier for formatting.
*   Utilize the `packages` directory for shared modules (dev-utils, hmr, i18n, module-manager, shared, storage, tailwind-config, tsconfig, ui, vite-config, zipper).

## Dependency management

*   Use pnpm for package management.
*   Keep dependencies up to date.
*   Use semantic versioning.

## Version control

*   Use Git for version control.
*   Use a `.gitignore` file to exclude unnecessary files.
*   Use a `.gitattributes` file to normalize line endings.
