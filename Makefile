install:
				npm install
run: 
				npx node 'bin/page-loader.js' --output /Users/dima/Documents/temp https://ru.hexlet.io/courses
publish: 
				npm publish --dry-run
lint:
				npx eslint .
test:
				npm run test -s
test-coverage:
				npm test -- --coverage
.PHONY:
				test