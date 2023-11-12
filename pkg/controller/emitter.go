package controller

import (
	"context"
	"errors"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/utils"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"log"
)

type Emitter interface {
	Emit(c context.Context, message string, payload any) error
}

type Event struct{}

func (e Event) Emit(c context.Context, message string, payload any) error {
	//runtime.EventsEmit(c, (string)(SignRequest), payload)
	runtime.EventsEmit(c, message, payload)
	return nil
}

type MockEvent struct {
	controller *Controller
}

func (m MockEvent) Emit(c context.Context, message string, p any) error {
	log.Println("emitting ", message, p)
	actualPayload, ok := p.(payload.Payload)
	if !ok {
		return errors.New(utils.ErrorNotPayload)
	}

	actualPayload.Signature = &payload.Signature{
		HexSignature: "6eb490f17f30c3e85f032ff47247499efe5cb0ce94dab5e31647612e361053574c96d584d3c185fb8474207e8f649d856b4d60b573a195d5e67e621a2b4c7f87",
		HexSalt:      "3da1f339213180ed4c46a12b6bd57eb6",
		HexPublicKey: "0382fcb005ae7652401fbe1d6345f77110f98db7122927df0f3faf3b62d1094071", //todo - should this come from the real wallet?
	}

	return m.controller.SignResponse(actualPayload) //force an immediate signing of the payload
}
