#!/usr/bin/env sh

[ -n "$CI" ] && exit 0
yarn husky install scripts/husky