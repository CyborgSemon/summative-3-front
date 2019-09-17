module.exports = function(grunt) {

	grunt.initConfig({
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
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');

	grunt.registerTask('default', ['watch']);
}
