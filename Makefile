
USERNAME ?= amlwwalker
ACCESS_TOKEN ?= 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

.PHONY: set-reg
set-reg:
	go env -w GOPRIVATE=github.com/configwizard/gaspump-api
	git config --add --global url."git@github.com:configwizard".insteadOf https://github.com/configwizard


LDFLAGS := -ldflags "-X main.version=$(shell git semver get)"

#when a new makor release is made, we run this
.PHONY: tag-major
tag-major:
	git semver major

#when small changes are made and we release, we run this
.PHONY: tag-minor
tag-minor:
	git semver minor

#while developing, run this to create an app
.PHONY: dev
dev:
	wails build -p ${LDFLAGS}

#when going to production, run this
.PHONY: prod
prod:
	wails build -p -f ${LDFLAGS}

# instructions on manually signing, in order are below
# now for the bit where an app is signed, notorized and stapled
#https://lessons.livecode.com/m/4071/l/1122100-codesigning-and-notarizing-your-lc-standalone-for-distribution-outside-the-mac-appstore
#note these commands should be run inside the build directory and therefore don't currently work as part of make

#1. make sure any attributes are removed
.PHONY: remove-attributes
remove-attributes:
	sudo xattr -lr "./build/EncryptEasy.app"

#2. set permissions on anything inside the app
.PHONY: set-permissions
set-permissions:
	sudo chmod -R u+rw "./build/EncryptEasy.app"

#3. sign the app itself
.PHONY: codesign-app
codesign-app:
	codesign --deep --force --verify --verbose --sign "Developer ID Application: Alexander Walker (65V77NRF7L)" --options runtime "./build/EncryptEasy.app"

#4. Verify that the app is signed
.PHONY: verify-app-signature
verify-app-signature:
	codesign --verify --verbose "./build/EncryptEasy.app"

#5. create a dmg and automatically sign it
.PHONY: dmg
dmg:
	cd build && \
	create-dmg ./EncryptEasy.app --dmg-title=EncryptEasy --identity="Developer ID Application: Alexander Walker (65V77NRF7L)" && \
	cd ..

#6. verify the DMG signature
.PHONY: verify-dmg-signature
verify-dmg-signature:
	codesign --verify --verbose ./build/EncryptEasy\ *.dmg

#7a. Store your app specific password against your apple ID in the keychain:
#security add-generic-password -a "<apple_id>" -w "<app_specific_password>"  -s "<keychain_item_name>"
# e.g security add-generic-password -a "amlwwalker@gmail.com" -w "tic-tac-toe"  -s "Notarizing" #replace tic-tac-toe with your 1 time password
# now we can use the keychain for notorization

#7b. Notorize the dmg
.PHONY: notorize
notorize:
	sudo xcrun altool -type osx --notarize-app --primary-bundle-id "app.encrypteasy" --username "amlwwalker@gmail.com" --password "@keychain:Notarizing" --file ./build/EncryptEasy\ *.dmg
#remember to record the request UUID, something like 47cb3c7f-7ffb-4d5c-bff1-7bbc7b064645

#8 Checl the dmg notorization status
.PHONY: notorize-status
notorize-status:
	xcrun altool --notarization-info 3abfba86-f449-4e25-8f5a-3af9c3f89a4f --username "amlwwalker@gmail.com" --password "@keychain:Notarizing"

#9. Once notorized, staple the notorization cert to the app so offline users can still use it
.PHONY: staple
staple:
	xcrun stapler staple -v ./build/EncryptEasy\ *.dmg

.PHONY: compress
compress:
	zip -j /Users/alex.walker/dev/sites/encrypteasy-site/dist/EncryptEasy.zip ./build/EncryptEasy\ *.dmg

.PHONE: move-dmg
move-dmg:
	mv ./build/EncryptEasy\ *.dmg /Users/alex.walker/dev/sites/encrypteasy-site/dist/

.PHONE: move-zip
move-zip:
	mv ./build/EncryptEasy.zip /Users/alex.walker/dev/sites/encrypteasy-site/dist/

.PHONY: release
release: prod dmg compress move-dmg move-zip
