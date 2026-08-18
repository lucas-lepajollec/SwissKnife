# Third-party notices

SwissKnife itself is licensed under the MIT License (see `LICENSE`).

This application bundles and serves a WebAssembly build of FFmpeg (`@ffmpeg/core`, `@ffmpeg/ffmpeg`) at runtime from the same origin (`/ffmpeg/`). That core is documented by the ffmpeg.wasm project as including, among other libraries, **x264**. FFmpeg and x264 are subject to their own licenses (LGPL/GPL depending on the build and enabled libraries).

If you redistribute SwissKnife together with the WASM core, review:

- https://ffmpeg.org/legal.html
- https://github.com/ffmpegwasm/ffmpeg.wasm
- the license files of `@ffmpeg/core` and `@ffmpeg/ffmpeg` in `node_modules`

Do not assume that the MIT license of this repository replaces the obligations attached to FFmpeg or x264.
