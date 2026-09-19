/**
 * Radio Waters - Alexa custom skill (Alexa-hosted Node.js)
 * Note for publication -- home testing only.
 * Live MP3 stream via the AudioPlayer interface.
 *
 * v2 fixes: canHandle must never call getIntentName before confirming the
 * request is an IntentRequest, and the error handler must never return speech
 * for an AudioPlayer / System request.
 */

const Alexa = require('ask-sdk-core');

const STREAM_URL = 'https://uk5.internet-radio.com/stream/radiowaters/stream.pls';
const STATION_NAME = 'Radio Waters';
const TOKEN = 'radio-waters-live';

// Request types that MUST receive an empty response. Returning speech to any
// of these is an invalid response and makes Alexa raise System.ExceptionEncountered.
function isSilentRequestType(type) {
  return type.startsWith('AudioPlayer.')
    || type.startsWith('PlaybackController.')
    || type === 'System.ExceptionEncountered'
    || type === 'SessionEndedRequest';
}

// Safe intent-name lookup: returns null instead of throwing on non-intent requests.
function intentNameOf(handlerInput) {
  if (Alexa.getRequestType(handlerInput.requestEnvelope) !== 'IntentRequest') return null;
  return Alexa.getIntentName(handlerInput.requestEnvelope);
}

function startStream(handlerInput, speech) {
  const builder = handlerInput.responseBuilder;
  if (speech) builder.speak(speech);
  return builder
    .addAudioPlayerPlayDirective(
      'REPLACE_ALL',
      STREAM_URL,
      TOKEN,
      0,
      null,
      { title: STATION_NAME, subtitle: 'Live stream' }
    )
    .withShouldEndSession(true)
    .getResponse();
}

function stopStream(handlerInput) {
  return handlerInput.responseBuilder
    .addAudioPlayerStopDirective()
    .getResponse();
}

// --- Silent handlers first, so nothing downstream can intercept them --------

const AudioPlayerEventHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope).startsWith('AudioPlayer.');
  },
  handle(handlerInput) {
    const req = handlerInput.requestEnvelope.request;
    console.log('AUDIOPLAYER_EVENT ' + req.type
      + ' offset=' + req.offsetInMilliseconds
      + ' error=' + JSON.stringify(req.error || null));
    return handlerInput.responseBuilder.getResponse();
  },
};

const SystemExceptionHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'System.ExceptionEncountered';
  },
  handle(handlerInput) {
    console.log('SYSTEM_EXCEPTION ' + JSON.stringify(handlerInput.requestEnvelope.request));
    return handlerInput.responseBuilder.getResponse();
  },
};

const PlaybackControllerHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope).startsWith('PlaybackController.');
  },
  handle(handlerInput) {
    const type = Alexa.getRequestType(handlerInput.requestEnvelope);
    if (type === 'PlaybackController.PlayCommandIssued') return startStream(handlerInput, null);
    return stopStream(handlerInput);
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

// --- Voice handlers ---------------------------------------------------------

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    return startStream(handlerInput, `Starting ${STATION_NAME}`);
  },
};

const StartStreamIntentHandler = {
  canHandle(handlerInput) {
    const name = intentNameOf(handlerInput);
    return name === 'PlayStreamIntent' || name === 'AMAZON.ResumeIntent';
  },
  handle(handlerInput) {
    return startStream(handlerInput, null);
  },
};

const StopStreamIntentHandler = {
  canHandle(handlerInput) {
    const name = intentNameOf(handlerInput);
    return name === 'AMAZON.PauseIntent'
      || name === 'AMAZON.StopIntent'
      || name === 'AMAZON.CancelIntent';
  },
  handle(handlerInput) {
    return stopStream(handlerInput);
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return intentNameOf(handlerInput) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(`Say, Alexa, open ${STATION_NAME}, to start the stream. Say stop to end it.`)
      .reprompt('What would you like to do?')
      .getResponse();
  },
};

const UnsupportedIntentHandler = {
  canHandle(handlerInput) {
    const unsupported = [
      'AMAZON.LoopOffIntent', 'AMAZON.LoopOnIntent',
      'AMAZON.NextIntent', 'AMAZON.PreviousIntent',
      'AMAZON.RepeatIntent', 'AMAZON.StartOverIntent',
      'AMAZON.ShuffleOffIntent', 'AMAZON.ShuffleOnIntent',
      'AMAZON.NavigateHomeIntent',
    ];
    return unsupported.indexOf(intentNameOf(handlerInput)) !== -1;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t do that on a live radio stream.')
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const type = Alexa.getRequestType(handlerInput.requestEnvelope);
    console.log('ERROR on ' + type + ': ' + error.message);
    console.log('STACK: ' + error.stack);
    // Never speak on a request type that requires an empty response.
    if (isSilentRequestType(type)) {
      return handlerInput.responseBuilder.getResponse();
    }
    return handlerInput.responseBuilder
      .speak('Sorry, something went wrong starting the stream.')
      .getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    AudioPlayerEventHandler,
    SystemExceptionHandler,
    PlaybackControllerHandler,
    SessionEndedRequestHandler,
    LaunchRequestHandler,
    StartStreamIntentHandler,
    StopStreamIntentHandler,
    HelpIntentHandler,
    UnsupportedIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
