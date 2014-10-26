module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: ['proximity/static/js/src/main.js',
              'proximity/static/js/src/models/*.js',
              'proximity/static/js/src/views/*.js',
              'proximity/static/js/src/routers/*.js'],
        dest: 'proximity/static/js/build/proximity.js',
      },
    },
    uglify: {
      my_target: {
        files: {
          'proximity/static/js/build/proximity.min.js': ['proximity/static/js/build/proximity.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default tasks.
  grunt.registerTask('default', ['concat','uglify']);

};