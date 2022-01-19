
USERNAME ?= amlwwalker
ACCESS_TOKEN ?= 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

.PHONY: set-reg
set-reg:
	go env -w GOPRIVATE=github.com/amlwwalker/gaspump-api
	git config --add --global url."git@github.com:amlwwalker".insteadOf https://github.com/amlwwalker
