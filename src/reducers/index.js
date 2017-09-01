const initialState = {
  videoSrc: '',
  videoElement: null,
  videoElementHeight: 0,
  videoElementWidth: 0,
  captureMode: false,
  poseMode: true,
  previewMode: false,
  identifyMode: false,
  lastCapturedImgData: '',
  lastCapturedImgBlob: null,
  resultContent: ''
};

const reducer = (state=initialState, action) => {
  if (action.type === 'SET_VIDEO_SRC') {
    return Object.assign({}, state, {videoSrc: action.videoSrc});
  }

  if (action.type === 'VIDEO_CAN_PLAY') {
    return Object.assign({}, state, {videoElement: action.video, videoElementHeight: action.video.videoHeight, videoElementWidth: action.video.videoWidth, resultContent: ''});
  };

  if (action.type === 'ENTER_CAPTURE_MODE') {
    return Object.assign({}, state, {captureMode: true});
  };

  if (action.type === 'EXIT_CAPTURE_MODE') {
    return Object.assign({}, state, {captureMode: false});
  };

  if (action.type === 'CANVAS_CAPTURE_COMPLETE') {
    const { lastCapturedImgData, lastCapturedImgBlob } = action;
    return Object.assign({}, state, {captureMode: false, poseMode: false, previewMode: true, lastCapturedImgData, lastCapturedImgBlob});
  }

  if (action.type === 'RESET_APP') {
    return Object.assign({}, state, {captureMode: false, poseMode: true, previewMode: false, identifyMode: false, resultContent: ''});
  }

  if (action.type === 'IDENTIFY_FACE_SUCCESSFUL') {
    return Object.assign({}, state, {resultContent: action.humanResult, identifyMode: true, previewMode: false});
  };

  if (action.type === 'IDENTIFY_FACE_ERROR') {
    return Object.assign({}, state, {resultContent: "Oops! Please make sure your face is clearly visible in the shot.", identifyMode: true, previewMode: false});
  };

  if (action.type === 'GET_MEDIA_ERROR') {
    return Object.assign({}, state, {resultContent: "Oops! We're having trouble accessing your webcam."});
  };

  return state;
};

export default reducer;
