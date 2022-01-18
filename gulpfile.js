const {
  src,
  dest,
  series,
  watch,
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();
const gulpFont=require('gulp-font');



function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@',
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest('dist'))
}


function scss() {
  return src('src/styles/**.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist'))
}
function img(){
  return src('src/img/*/**.{png,gif,jpg}')
  .pipe(dest('dist/img'))
}
function img_folders(){
  return src('src/img/**.{png,gif,jpg}')
  .pipe(dest('dist/img'))
}

async function clear() {
  del('dist');
}
function fonts(){
  return src('src/font/*/**.{ttf,otf}')
  .pipe(dest('dist/font'))
}
// function font() {
//   return src('src/font/**/*.{ttf,otf}', { read: false })
//       .pipe(gulpFont({
//           ext: '.css',
//           fontface: 'src/font',
//           relative: '/font',
//           dest: 'dist/font',
//           embed: ['woff'],
//           collate: false
//       }))
//       .pipe(dest('dist/font'));
// }

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/styles/**.scss', series(scss)).on('change', sync.reload)
  watch('src/parts/**.html', series(html)).on('change', sync.reload)
}


exports.start = series(clear, html,img,img_folders,fonts, scss, serve);
exports.reload = series(html,img, scss,img_folders,fonts, serve);

exports.delete = series(clear);