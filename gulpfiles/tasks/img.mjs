import gulp from 'gulp';
import { globs, paths } from '../config.mjs';

//webp生成
import gulpWebp from 'gulp-webp';
import rename from 'gulp-rename';

//WebPへ変換
export const webp = () => {
  return gulp
    .src(globs.toWebp, {
      allowEmpty: true,
      since: gulp.lastRun(webp),
    })
    .pipe(
      rename((path) => {
        path.basename += path.extname;
      })
    )
    .pipe(gulpWebp())
    .pipe(gulp.dest(paths.imageDistDir));
};
