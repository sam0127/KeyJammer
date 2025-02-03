#!/usr/bin/env sh
git checkout --orphan gh-pages

npm run build-prod
rollup dist/src/index.js --format iife --file dist/js/index.js
rm -rf dist/src
uglifyjs dist/js/index.js -o dist/js/index.js --compress

git --work-tree dist add --all
git --work-tree dist commit -m "gh-pages deployment"
git push origin HEAD:gh-pages --force
rm -r dist
git checkout -f main
git branch -D gh-pages