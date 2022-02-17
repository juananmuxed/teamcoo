# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Configuration in the backoffice for Web customization and mails #55 FEATURE
- Mail Endpoint
- Static Pages Creation #38 FEATURE
- Refactor and redesign
- Soft deleted items in DB
- Loading before all colors and images load
- Tables server sided
- New Limit property to tasks
- Filter to a users searcher by Workgroups
- Conditional to the filters (if no selected, no One/All option chip)
- One-to-one email send for admin/coordinator roles
- Users can be volunteer accepting a form

### Changed

- MJML and Handlebars for template the mails
- Card users and menu in user chips

### Fixed

- Verification mail with localhost url #47 BUG

## [0.10.0] - 2021-11-04

### Added

- Deployment with Docker optimiced

### Changed

- Method for save files (images or pdf) in API has a radical change (now use a simple folder)

### Fixed

- Upload files
- Save user data

## [0.9.0] - 2021-05-11

### Added

- Views for Users, Workgroups, Interests and Menu.
- Static pages editable in config
- Moduled Static Pages (easily add or 1 more in config.json)
- Added complete functionality for Users, Workgroups, Interests and Menu (add or remove, edit, etc...)
- Admin Menu implementation
- Dockerify all project to easy deploy
- Configuration files for Docker
- ENV Variables

### Changed

- Bcrypt is replaced by Bcryptjs (errors in Docker)
- All `imports` in the API for `require` and `export default` for compatibility with ES5
- DB url to adapt to Docker deployment `localhost:27017` => `datapistas-db:27017`
- Change Actions name to Tasks name
- Split files for modular

## [0.3-beta] - 2020-05-08

### Added

- Added View for all Question united
- Added complete functionality for Questions (add or remove, edit, etc...)

### Removed

- Duplicated Functions
- View for individual Question (not needed)

## [0.2-beta] - 2020-05-03

### Added

- New Util (compare Arrays)
- Added View for all Workgroups united
- Added complete functionality for Work Groups (add or remove, edit, etc...)
- Included new view for edit members/coors

### Removed

- Duplicated Functions

## [0.1-beta] - 2020-04-16

### Added

- First Commit with all the progress
- Included [README](README.md), [CONTRIBUTING](CONTRIBUTING.md), [CODE OF CONDUCT](CODE_OF_CONDUCT.md) and [THIS FILE](CHANGELOG.md)
- Starting...

### Changed

- Update all Version Dependencies (Vue, vuex, vuetify, etc...) to the latest stable versions

### Removed

- Duplicated README in public folder

[unreleased]: https://github.com/juananmuxed/teamcoo/compare/v0.10.0...HEAD
[0.10.0]: https://github.com/juananmuxed/teamcoo/releases/tag/v0.10.0
[0.9.0]: https://github.com/juananmuxed/teamcoo/releases/tag/v0.9.0
[0.3-beta]: https://github.com/juananmuxed/teamcoo/releases/tag/v0.3-beta
[0.2-beta]: https://github.com/juananmuxed/teamcoo/releases/tag/v0.2-beta
[0.1-beta]: https://github.com/juananmuxed/teamcoo/releases/tag/v0.1-beta
