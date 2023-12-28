import { paths } from '../config.mjs';
import browserSync from 'browser-sync';

export const browsersync = (done) => {
  browserSync.init({
    proxy: paths.serverDir,
    open: 'external',
  });
  done();
};

export const browsersyncStream = (done) => {
  browserSync.reload({
    stream: true,
  });
  done();
};

export const reload = (done) => {
  browserSync.reload();
  done();
};
