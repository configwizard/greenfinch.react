.PHONY: default
default:
	wails dev

.PHONY: docs
docs:
	swag init -g "main.go" && cp docs/swagger.json ./swagger

LDFLAGS := -ldflags "-X main.version=$(shell git semver get)"

#when a new makor release is made, we run this
.PHONY: tag-major
tag-major:
	git semver major

#when small changes are made and we release, we run this
.PHONY: tag-minor
tag-minor:
	git semver minor

#when patch changes are made and we release, we run this
.PHONY: tag-patch
tag-patch:
	git semver patch

#while developing, run this to create an app
.PHONY: dev
dev:
	wails build ${LDFLAGS}

#when going to production, run this
.PHONY: prod
prod:
	wails build -p -f ${LDFLAGS}

.PHONY: win
win:
	wails build -p -nsis -f ${LDFLAGS} -platform windows/arm64,windows/amd64
