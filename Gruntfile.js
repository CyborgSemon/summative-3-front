module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
			dist: {
				files: {
					'css/main.css': `scss/main.scss`
				}
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: `css/`,
					src: [`*.css`, `!*.min.css`],
					dest: `css/`,
					ext: `.min.css`
				}]
			}
		},
		uglify: {
			my_target: {
				files: {
					'js/main.min.js': ['js/main.js']
				},
				options: {
					esversion: 6
				}
			}
		},
		jshint: {
			files: ['js/*.js', '!js/*.min.js'],
			options: {
				esversion: 6
			}
		},
		watch: {
			js: {
				files: ['js/*.js', '!js/*.min.js'],
				tasks: ['jshint', 'uglify']
			},
			sass: {
				files: ['scss/*.scss'],
				tasks: ['sass']
			},
			cssmin: {
				files: ['css/*.css', '!css/*.min.css'],
				tasks: ['cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');

	grunt.registerTask('default', ['watch']);
}
