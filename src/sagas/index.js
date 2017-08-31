import { call, put, takeEvery, all } from 'redux-saga/effects';
import { subscriptionKey, personGroup, willmanid } from '../secrets';

function* onGetMediaRequested() {
  try {
    const stream = yield call(getMediaStream);
    yield put({type: "GET_MEDIA_SUCCESSFUL", stream});
  } 
  catch(error) {
    yield put({type: "GET_MEDIA_ERROR", error});
  }
};

function getMediaStream() {
  return new Promise((resolve, reject) => {
    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    const getMediaOptions = {
      video: true,
      audio: false
    };
    navigator.getMedia(getMediaOptions, resolve, reject);
  });
};

function* onGetMediaSuccess({stream}) {
  const vendorURL = window.URL || window.webkitURL;
  const src = vendorURL.createObjectURL(stream);
  yield put({type: "SET_VIDEO_SRC", videoSrc: src});
}

function* onGetMediaError({error}) {
  console.log('error getting media stream:', error);
}

function* onIdentifyFace({photo}) {
  try {
    const faces = yield call(detectFaces, photo);
    const prediction = yield call(recogniseFaces, faces);
    console.log(prediction);

    const result = prediction[0].candidates.length ? prediction[0].candidates[0].personId : "";
    const humanResult = (result === willmanid) ? "Yes! I think it's Willman." : "No, I don't think it's Willman.";
    yield put({type: "IDENTIFY_FACE_SUCCESSFUL", humanResult});
  } 
  catch(error) {
    yield put({type: "IDENTIFY_FACE_ERROR", error});
  }
};

function detectFaces(photo) {
  const detectUrl = 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true';
  const options = {
    method: "POST",
    body: photo,
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };
  return fetch(detectUrl, options).then((response) => response.json());
};

function recogniseFaces(facelist) {
  if (!facelist.length) Promise.reject(new Error("ENO_FACES"));
 
  const identifyUrl = 'https://westus.api.cognitive.microsoft.com/face/v1.0/identify';
  const faceids = facelist.map((face) => face.faceId);
  
  const body = {    
      "personGroupId": personGroup,
      "faceIds": faceids,
      "maxNumOfCandidatesReturned": 1,
      "confidenceThreshold": 0.4
  }
  
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };

  return fetch(identifyUrl, options).then((response) => response.json());
};

export default function* rootSaga() {
  console.log('hello I am saga');

  yield takeEvery("GET_MEDIA_SUCCESSFUL", onGetMediaSuccess);
  yield takeEvery("GET_MEDIA_REQUESTED", onGetMediaRequested);
  yield takeEvery("GET_MEDIA_ERROR", onGetMediaError);
  yield takeEvery("IDENTIFY_FACE", onIdentifyFace);
}
