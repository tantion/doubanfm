/*global module:false*/
/*jshint indent:2*/
module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        //src: [],
        //dest: ''
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /"version": "[\d\.]+"/,
              replacement: '"version": "<%= pkg.version %>"',
              expression: true
            }, {
              match: /"description": ".+"/,
              replacement: '"description": "<%= pkg.description%>"',
              expression: true
            }, {
              match: /\?v[\d\.]+'/,
              replacement: '?v<%= pkg.version %>\'',
              expression: true
            }
          ]
        },
        files: {
          'src/manifest.json': 'src/manifest.json',
          'src/config.js': 'src/config.js',
          'src/doubanfm.js': 'src/doubanfm.js'
        }
      }
    },
    clean: ['dist/*'],
    copy: {
      dist: {
        files: [{expand: true, cwd: 'src/', src: ['**'], dest: 'dist/'}]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        //src: '',
        //dest: ''
      }
    },
    jshint: {
      options: {
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      packagefile: {
        files: 'package.json',
        tasks: ['replace:dist']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['replace', 'clean', 'copy', 'jshint', 'concat', 'uglify']);

};
