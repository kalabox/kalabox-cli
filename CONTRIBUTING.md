Contributing to the Kalabox CLI
=======================

Creating Issues
---------------

ALL issues regarding the Kalabox CLI should be created on the main Kalabox
project page: https://github.com/kalabox/kalabox/issues

If you create an issue there, please read the main 
[contribution guide](https://github.com/kalabox/kalabox/blob/HEAD/CONTRIBUTING.md) 
and follow issue guidelines that are posted as the first comment on your 
issue once it has been created.

Setting Up for Development
--------------------------

#### 1. Install Kalabox

Use the [latest installer](http://www.kalabox.io) to get all the Kalabox 
fundamentals (primarily the VM and the necessary docker binaries in 
~/.kalabox/bin).

#### 2. Install dev dependencies

You'll need to get node, grunt, and the kalabox-cli repo setup to start
development.

**On MacOSX**

NOTE: You might want to make sure you get npm set up so you can install global modules without sudo. Agree to install command line tools if it prompts you when you run the git step.

```
cd /tmp
# Might want to grab the latest node pkg
curl -LO https://nodejs.org/dist/v4.2.6/node-v4.2.6.pkg
sudo -S installer -pkg "/tmp/node-v4.2.6.pkg" -target /
npm install -g grunt-cli
git clone https://github.com/kalabox/kalabox-cli.git
```

**On Windows**


Make sure you have installed Node 4.2 and GIT. See https://github.com/kalabox/kalabox-ted/tree/master/scripts/build for some helpful scripts.

```
npm install -g grunt-cli
git clone https://github.com/kalabox/kalabox-cli.git
```

**On Debian**

NOTE: You might want to make sure you get npm set up so you can install global modules without sudo

```
sudo apt-get -y update
sudo apt-get -y install git-core curl
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get -y install nodejs
npm install -g grunt-cli
git clone https://github.com/kalabox/kalabox-cli.git
```

**On Fedora**

???

#### 3. Run from source

On OSX and linux you can link the CLI entrypoint bin/kbox.js to somewhere in
your path.
```
ln -s /path/to/repo/bin/kbox.js /usr/local/bin/kbox.dev
which kbox.dev
kbox.dev up
```

Or you can just run the kalabox CLI from the bin directory.
```
./bin/kbox.js
```

Submitting Fixes
----------------

Perform all of your work in a forked branch of kalabox-ui, named in the
convention [issue number]-some-short-desc.

Once you've satisfied all of the criteria on a given issue from the main
kalabox/kalabox issue queue (including documentation additions and writing 
tests), submit a pull request.

Please always reference the main Kalabox issue in your commit messages and pull 
requests using the kalabox/kalabox#[issue number] syntax.

Testing
-------

We have code linting, unit, unit coverage, and functional testing for
kalabox-cli. The linting uses jshint and jscs. The unit tests use mocha
and chai. The functional testing uses bats (bash file testing).

#### Running Tests

Run code linting, unit, and unit coverage tests:

`grunt test`

Run functional tests:

`grunt test:func`

#### Writing Tests

Tests are in the "test" folder in the root of the kalabox-cli project. For
examples of unit tests look for "*.spec.js" files in the "test" folder. For
examples of functional tests look for "*.bats" files in the "test" folder.

Looking at existing tests will give you a good idea of how to write your own,
but if you're looking for more tips, we recommend:

- [Mocha documentation](http://mochajs.org/)
- [Chai documentation](http://chaijs.com/)
- [Chai-As-Promised documentation](http://chaijs.com/plugins/chai-as-promised/)
