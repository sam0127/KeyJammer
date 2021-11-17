module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          sourcemap: false,
          compress: false,
          yuicompress: false,
          style: 'expanded',
        },
        files: {
          'src/css/styles.css' : 'src/scss/main.scss'
        }
      },
    },
    concat: {
      options: {
        separator: '\n/*next file*/\n\n'
      },
      dist: {
        src: ['src/js/page.js','src/js/midi.js','src/js/audio.js'],
        dest: 'src/js/main.js'
      }
    },
    uglify: {
      dev: {
        files: {
          'src/js/main.min.js': ['src/js/main.js']
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['src/*.html','src/components/*.html']
      },
      css: {
        files: ['src/scss/*.scss'],
        tasks: ['sass']
      },
      js: {
        files: ['src/js/page.js','src/js/midi.js','src/js/audio.js'],
        tasks: ['concat','uglify:dev']
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          base: 'src/',
          hostname: '0.0.0.0',
          protocol: 'http',
          livereload: true,
          open: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default',['watch']);
  grunt.registerTask('server', ['connect','watch']);
};
