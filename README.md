# Ember-gitlab-pages

Pretty much lifted bodily (with minor changes) from [ember-cli-github-pages](https://github.com/poetic/ember-cli-github-pages)

### Install and Setup
Pretty much the exact same as the github-pages version:

```shell
ember install ember-gitlab-pages
```
You'll still need to do first time setup onto your `pages` branch:

```sh
git add -A && git commit -m "Added ember-cli-github-pages addon"
```

Then you need to create the `pages` branch and remove the unnecessary files:

```sh
git checkout --orphan pages && rm -rf `bash -c "ls -a | grep -vE '\.gitignore|\.git|\.gitlab-ci\.yml|node_modules|bower_components|(^[.]{1,2}/?$)'"` && git add -A && git commit -m "initial pages commit"
```
this addon also ships with a macro for the above command
```sh
ember gitlab-pages:init
```

### Usage
Once that's done, it's pretty much the same thing as in github-pages, except replace github with gitlab.

Then run ember gitlab-pages:commit --message "some commit message" in order to rebuild pages branch.

```sh
git checkout master
ember gitlab-pages:commit --message "Initial gitlab pages release"
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
