install:
				npm install
publish: 
				npm publish --dry-run
lint:
				npx eslint .
test:
				npm test -s
test-coverage:
				npm test -- --coverage
.PHONY:
				test