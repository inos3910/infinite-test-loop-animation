import gulp from 'gulp';
import { globs } from '../config.mjs';
import { buildCss } from './css.mjs';
import { buildJs } from './js.mjs';
import { reload } from './browsersync.mjs';

export const watcher = (done) => {
  gulp.watch(globs.html, reload);
  gulp.watch(globs.sass, buildCss);
  gulp.watch(globs.js, gulp.series(buildJs, reload));
  done();
};
