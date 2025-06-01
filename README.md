<div align="center">

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/99cb6303-64e4-4bed-bf3f-35735353e6de" />
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/a5dbf71c-c509-4c4f-80f4-be88a1943b0a" />
    <img alt="Logo" src="https://github.com/user-attachments/assets/99cb6303-64e4-4bed-bf3f-35735353e6de" />
</picture>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)

![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/build-zip.yml/badge.svg)
![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/lint.yml/badge.svg)

<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/Jonghakseo/chrome-extension-boilerplate-react-viteFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/>
<a href="https://discord.gg/4ERQ6jgV9a" target="_blank"><img src="https://discord.com/api/guilds/1263404974830915637/widget.png"/></a>

> Boilerplate này
> có [Phiên bản Legacy](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/tree/legacy)

</div>

> [!NOTE]
> Dự án này được liệt kê trong [Awesome Vite](https://github.com/vitejs/awesome-vite)

> [!TIP]
> Chia sẻ trạng thái lưu trữ giữa tất cả các trang
>
> https://github.com/user-attachments/assets/3b8e189f-6443-490e-a455-4f9570267f8c

## Mục lục

- [Giới thiệu](#intro)
- [Tính năng](#features)
- [Cấu trúc](#structure)
    - [ChromeExtension](#structure-chrome-extension)
    - [Packages](#structure-packages)
    - [Pages](#structure-pages)
- [Bắt đầu](#getting-started)
    - [Chrome](#getting-started-chrome)
    - [Firefox](#getting-started-firefox)
- [Cài đặt dependencies](#install-dependency)
    - [Cho root](#install-dependency-for-root)
    - [Cho module](#install-dependency-for-module)
- [Biến môi trường](#env-variables)
    - [Thêm mới](#env-variables-new)
    - [Đặt qua CLI](#env-variables-cli-set)

## Giới thiệu

Boilerplate này giúp bạn tạo các extension Chrome/Firefox sử dụng React và TypeScript. Nó cải thiện
tốc độ build và trải nghiệm phát triển bằng cách sử dụng Vite và Turborepo.

## Tính năng

- [React19](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/) với [Rollup](https://rollupjs.org/)
- [Turborepo](https://turbo.build/repo)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Chrome Extensions Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Package i18n tùy chỉnh](/packages/i18n/)
- [Plugin HMR (Hot Module Rebuild) tùy chỉnh](/packages/hmr/)
- [Kiểm thử end-to-end với WebdriverIO](https://webdriver.io/)

## Bắt đầu

1. Khi bạn sử dụng Windows, chạy lệnh này:
    - `git config --global core.eol lf`
    - `git config --global core.autocrlf input`

   **Điều này sẽ đặt ký tự EOL (End of line) giống như trên Linux/macOS. Nếu không có điều này, bash script sẽ không
   hoạt động và bạn sẽ gặp xung đột với các lập trình viên trên Linux/macOS.**
2. Clone repository này.( ```git clone https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite``` )
3. Đảm bảo phiên bản node của bạn >= phiên bản trong file `.nvmrc`, khuyến nghị sử dụng [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#intro)
4. Chỉnh sửa `/packages/i18n/locales/`{locale của bạn}/`messages.json`
5. Trong các đối tượng `extensionDescription` và `extensionName`, thay đổi các trường `message` (để nguyên `description`)
6. Trong `/.package.json`, thay đổi `version` thành phiên bản mong muốn của extension.
7. Cài đặt pnpm globally: `npm install -g pnpm` (đảm bảo phiên bản node >= 22.12.0)
8. Chạy `pnpm install`

Sau đó, tùy thuộc vào trình duyệt đích:

### Cho Chrome: <a name="getting-started-chrome"></a>

1. Chạy:
    - Dev: `pnpm dev` (trên Windows, bạn nên chạy với quyền administrator;
      xem [issue#456](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/456))
    - Prod: `pnpm build`
2. Mở trong trình duyệt - `chrome://extensions`
3. Tích - <kbd>Developer mode</kbd>
4. Click - <kbd>Load unpacked</kbd> ở góc trên bên trái
5. Chọn thư mục `dist` từ dự án boilerplate

### Cho Firefox: <a name="getting-started-firefox"></a>

1. Chạy:
    - Dev: `pnpm dev:firefox`
    - Prod: `pnpm build:firefox`
2. Mở trong trình duyệt - `about:debugging#/runtime/this-firefox`
3. Click - <kbd>Load Temporary Add-on...</kbd> ở góc trên bên phải
4. Chọn file `./dist/manifest.json` từ dự án boilerplate

> [!NOTE]
> Trong Firefox, bạn tải add-ons ở chế độ tạm thời. Có nghĩa là chúng sẽ biến mất sau mỗi lần đóng trình duyệt. Bạn phải
> tải add-on mỗi lần khởi động trình duyệt.

## Cài đặt dependency cho turborepo: <a name="install-dependency"></a>

### Cho root: <a name="install-dependency-for-root"></a>

1. Chạy `pnpm i <package> -w`

### Cho module: <a name="install-dependency-for-module"></a>

1. Chạy `pnpm i <package> -F <tên module>`

`package` - Tên của package bạn muốn cài đặt ví dụ: `nodemon` \
`module-name` - Bạn có thể tìm thấy nó trong mỗi `package.json` dưới key `name`, ví dụ: `@extension/content-script`, bạn
có thể chỉ sử dụng `content-script` mà không cần prefix `@extension/`

## Làm thế nào để vô hiệu hóa các module tôi không sử dụng?

```bash
$ pnpm module-manager
```

Đọc: [Module Manager](packages/module-manager/README.md)

## Biến môi trường

Đọc: [Env Documentation](packages/env/README.md)

## Cấu trúc Boilerplate <a name="structure"></a>

### Chrome extension <a name="structure-chrome-extension"></a>

Extension nằm trong thư mục `chrome-extension` và bao gồm các file sau:

- [`manifest.ts`](chrome-extension/manifest.ts) - script xuất ra `manifest.json`
- [`src/background`](chrome-extension/src/background) - [background script](https://developer.chrome.com/docs/extensions/mv3/background_pages/)
  (`background.service_worker` trong manifest.json)
- [`public`](chrome-extension/public/) - icons được tham chiếu trong manifest; content CSS để inject vào trang người dùng

> [!IMPORTANT]
> Để thuận tiện cho việc phát triển, boilerplate được cấu hình để "Đọc và thay đổi tất cả dữ liệu của bạn trên tất cả các trang web".
> Trong production, thực hành tốt nhất là giới hạn quyền chỉ cho các trang web thực sự cần thiết. Xem
> [Declaring permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
> và chỉnh sửa `manifest.js` cho phù hợp.

### Pages <a name="structure-pages"></a>

Code được transpile để trở thành một phần của extension nằm trong thư mục [pages](pages/).

- [
  `content`](pages/content/) - [content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)
  (`content_scripts` trong manifest.json)
- [`content-ui`](pages/content-ui) - React UI được render trong trang hiện tại (bạn có thể thấy nó ở cuối trang khi bắt đầu)
  (`content_scripts` trong manifest.json)
- [
  `content-runtime`](pages/content-runtime/src/) - [injected content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#functionality);
  có thể được inject từ `popup` như `content` tiêu chuẩn
- [
  `devtools`](pages/devtools/) - [mở rộng browser DevTools](https://developer.chrome.com/docs/extensions/how-to/devtools/extend-devtools#creating)
  (`devtools_page` trong manifest.json)
- [
  `devtools-panel`](pages/devtools-panel/) - [DevTools panel](https://developer.chrome.com/docs/extensions/reference/api/devtools/panels)
  cho [devtools](pages/devtools/src/index.ts)
- [
  `new-tab`](pages/new-tab/) - [ghi đè trang New Tab mặc định](https://developer.chrome.com/docs/extensions/develop/ui/override-chrome-pages)
  (`chrome_url_overrides.newtab` trong manifest.json)
- [`options`](pages/options/) - [trang options](https://developer.chrome.com/docs/extensions/develop/ui/options-page)
  (`options_page` trong manifest.json)
- [`popup`](pages/popup/) - [popup](https://developer.chrome.com/docs/extensions/reference/api/action#popup) hiển thị khi
  click vào extension trên toolbar
  (`action.default_popup` trong manifest.json)
- [
  `side-panel`](pages/side-panel/) - [sidepanel (Chrome 114+)](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
  (`side_panel.default_path` trong manifest.json)

### Packages <a name="structure-packages"></a>

Một số shared packages:

- `dev-utils` - tiện ích cho việc phát triển Chrome extension (manifest-parser, logger)
- `env` - xuất object chứa tất cả biến môi trường từ `.env` và được khai báo động
- `hmr` - plugin HMR tùy chỉnh cho Vite, injection script để reload/refresh, HMR dev-server
- `i18n` - package quốc tế hóa tùy chỉnh; cung cấp hàm i18n với type safety và các validation khác
- `shared` - code dùng chung cho toàn bộ dự án (types, constants, custom hooks, components v.v.)
- `storage` - helpers để tích hợp dễ dàng hơn với [storage](https://developer.chrome.com/docs/extensions/reference/api/storage), ví dụ: local/session storages
- `tailwind-config` - cấu hình Tailwind dùng chung cho toàn bộ dự án
- `tsconfig` - tsconfig dùng chung cho toàn bộ dự án
- `ui` - hàm để merge cấu hình Tailwind của bạn với cấu hình global; bạn có thể lưu components ở đây
- `vite-config` - cấu hình Vite dùng chung cho toàn bộ dự án

Các packages hữu ích khác:

- `zipper` - chạy `pnpm zip` để đóng gói thư mục `dist` thành `extension-YYYYMMDD-HHmmss.zip` trong thư mục `dist-zip` mới tạo
- `module-manager` - chạy `pnpm module-manager` để bật/tắt modules
- `e2e` - chạy `pnpm e2e` để kiểm thử end-to-end extension đã được zip trên các trình duyệt khác nhau

