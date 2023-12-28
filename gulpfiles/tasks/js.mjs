import { globs, paths } from '../config.mjs';
import gulp from 'gulp';
import path from 'path';
import glob from 'glob';
import { deleteSync } from 'del'; //ファイル削除
import plumber from 'gulp-plumber'; //エラーでgulpが終了するのを止める
import notify from 'gulp-notify'; //デスクトップ通知
import gulpEsbuild from 'gulp-esbuild';
import rename from 'gulp-rename';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from '../webpack.config.mjs';
import named from 'vinyl-named'; //webpackでファイル結合時に名前変更

const is_production = process.env.NODE_ENV === 'production';
const esbuildConfig = {
  entryPoints: glob.sync(globs.entry),
  bundle: true,
  minify: is_production,
  platform: 'browser',
  target: 'es6',
  sourcemap: !is_production,
  outbase: paths.jsSrcDir,
  outdir: './',
  minifyWhitespace: true,
  minifySyntax: true,
};

//出力済みファイルを削除
export const deleteJsDistDir = (done) => {
  deleteSync([paths.jsDistDir]);
  done();
};

// dev build
export const buildJs = () => {
  return gulp
  .src(globs.entry, {
    allowEmpty: true,
  })
  .pipe(
    plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    })
    )
  .pipe(gulpEsbuild(esbuildConfig))
  .pipe(
    rename((renamePath) => {
      const name = renamePath.dirname && renamePath.dirname !== '.' ? path.parse(renamePath.dirname).name : 'code';
      renamePath.basename = `${name}.bundle`;
      renamePath.dirname = '';
    })
    )
  .pipe(gulp.dest(paths.jsDistDir))
  .pipe(notify('buildJs finished'));
};

//prod build
export const buildJsAll = () => {
  return gulp
  .src(globs.entry, {
    allowEmpty: true,
  })
  .pipe(
    plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    })
    )
  .pipe(
    named((file) => {
      console.log(path.parse(file.relative));
      return path.parse(file.relative).dir ? path.parse(file.relative).dir : 'code';
    })
    )
  .pipe(webpackStream(webpackConfig, webpack))
  .pipe(gulp.dest(paths.jsDistDir))
  .pipe(notify('build:js-all finished'));
};
