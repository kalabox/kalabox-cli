Contributing to the Kalabox CLI
=======================

Creating Issues
---------------

**ALL ISSUES** for the Kalabox should be created on the main Kalabox
project page: https://github.com/kalabox/kalabox/issues

Once you create an issue please follow the guidelines that are posted as the
first comment on your.

Issue tags
----------

Here is a list of the tags we use on our issues and what each means.

#### Issue tags

* **bug fix** - The issue indicates a buggy feature that needs to be fixed.
* **duplicate** - The issue is expressed already elsewhere.
* **enhancement** - The issue wishes to improve a pre-existing feature.
* **feature** - The issue contains new proposed functionality.
* **task** - The issue is a non-development related task such as documentation.

#### Kalabox tags

* **cli** - The issue manifested using the cli.
* **gui** - The issue manifested using the gui.
* **installer** - The issue manifested using the installer.

#### Additional tags

* **sprint ready** - The issue is in a good state for action.
* **blocker** - The issue is currently blocking the completion of other issues.
* **Epic** - The issue acts as a container for other issues.

Epic Guidelines
---------------

An issue should be expressed as an epic if it satisfies the following two
critera

1. A feature which is best expressed as more than one issue.
2. Each sub-issue is shippable by itself.

Contributing to other Kalabox projects
--------------------------------------

The rest of this guide is dedicated to working on the CLI portion of
Kalabox. If you are actually interesting in working on other Kalabox projects
please check out their respective CONTRIBUTION.mds.

* [kalabox](https://github.com/kalabox/kalabox/blob/HEAD/CONTRIBUTING.md)
* [kalabox-ui](https://github.com/kalabox/kalabox-ui/blob/HEAD/CONTRIBUTING.md)
* [kalabox-app-php](https://github.com/kalabox/kalabox-app-php/blob/HEAD/CONTRIBUTING.md)
* [kalabox-app-pantheon](https://github.com/kalabox/kalabox-app-pantheon/blob/HEAD/CONTRIBUTING.md)

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

Submitting Fixes
----------------

Perform all of your work in a forked branch of kalabox, preferably named in the
convention `[issue number]-some-short-desc`. Please also prefix your commits
with a relevant issue number if applicable ie

`#314: Adding pi to list of known trancendental numbers`

When you feel like your code is ready for review open a pull request against
the kalabox repository. The pull request will auto-generate a checklist
of things you need to do before your code will be considered merge-worthy.

Please always reference the main Kalabox issue in your commit messages and pull
requests using the kalabox/kalabox#[issue number] syntax.
