import gulp from 'gulp';
import sass from 'gulp-dart-sass';
//エラーでgulpが終了するのを止める
import plumber from 'gulp-plumber';
//デスクトップ通知
import notify from 'gulp-notify';
//小さい画像をbase64に変換
import base64 from 'gulp-base64';
//PostCss
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
//flexboxのバグを自動修正
import flexBugsFixes from 'postcss-flexbugs-fixes';
//ファイル名から画像パスやサイズを取得
import assets from 'postcss-assets';
//メディアクエリを整理する
import mqpacker from 'css-mqpacker';
//cssを圧縮する
import csso from 'gulp-csso';
//config
import { paths, globs } from '../config.mjs';
//cache
import cache from 'gulp-cached';
//ファイル削除
import { deleteSync } from 'del';
import dependents from 'gulp-dependents';
import sassGlob from 'gulp-sass-glob-use-forward';
import browserSync from 'browser-sync';

const dependentsConfig = {
  '.scss': {
    parserSteps: [
      /(?:^|;|{|}|\*\/)\s*@(import|use|forward|include)\s+((?:"[^"]+"|'[^']+'|url\((?:"[^"]+"|'[^']+'|[^)]+)\)|meta\.load\-css\((?:"[^"]+"|'[^']+'|[^)]+)\))(?:\s*,\s*(?:"[^"]+"|'[^']+'|url\((?:"[^"]+"|'[^']+'|[^)]+)\)|meta\.load\-css\((?:"[^"]+"|'[^']+'|[^)]+)\)))*)(?=[^;]*;)/gm,
      /"([^"]+)"|'([^']+)'|url\((?:"([^"]+)"|'([^']+)'|([^)]+))\)|meta\.load\-css\((?:"([^"]+)"|'([^']+)'|([^)]+))\)/gm,
    ],
    prefixes: ['_'],
    postfixes: ['.scss', '.sass'],
    basePaths: [],
  },
};

//出力済みファイルを削除
export const deleteCssDir = (done) => {
  deleteSync([paths.cssDistDir]);
  done();
};

const processors = [
  assets({
    baseUrl: `${paths.serverDir}/`,
    basePath: paths.themeDir,
    loadPaths: ['assets/images/', 'assets/svg/'],
    relative: true,
    cachebuster: true,
  }),
  autoprefixer({
    cascade: false,
    grid: true,
  }),
  mqpacker({
    sort: true,
  }),
  flexBugsFixes,
];

export const buildCss = () => {
  return gulp
    .src(globs.sass, {
      allowEmpty: true,
      sourcemaps: true,
    })
    .pipe(sassGlob())
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(cache('scss'))
    .pipe(dependents(dependentsConfig, { logDependents: true }))
    .pipe(sassGlob())
    .pipe(
      sass
        .sync({
          includePaths: ['node_modules', 'assets/sass'],
          outputStyle: 'expanded',
        })
        .on('error', sass.logError)
    )
    .pipe(
      base64({
        baseDir: paths.imageDir,
        extensions: ['svg', 'png', /\.jpg#datauri$/i],
        exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
        maxImageSize: 8 * 1024,
        debug: true,
      })
    )
    .pipe(postcss(processors))
    .pipe(
      csso({
        restructure: false,
        sourceMap: false,
        debug: true,
      })
    )
    .pipe(
      gulp.dest(paths.cssDistDir, {
        sourcemaps: '.',
      })
    )
    .pipe(notify('buildCss finished'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
};
