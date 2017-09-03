import { call, put, takeEvery, all } from 'redux-saga/effects';
import { subscriptionKey, personGroup, personId } from '../secrets';

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
  const constraints = {
    video: true,
    audio: false
  };

  return navigator.mediaDevices.getUserMedia(constraints);
};

function* onGetMediaSuccess({stream}) {
  const vendorURL = window.URL || window.webkitURL;
  const src = vendorURL.createObjectURL(stream);
  yield put({type: "SET_VIDEO_SRC", videoSrc: src});
}

function* onIdentifyFace({photo}) {
  try {
    const faces = yield call(detectFaces, photo);
    if (!faces.length) return yield put({type: "IDENTIFY_FACE_ERROR"});

    const prediction = yield call(recogniseFaces, faces);

    const result = prediction[0].candidates.length ? prediction[0].candidates[0].personId : "";
    const humanResult = (result === personId) ? "Yes! I think it's Willman." : "No, I don't think it's Willman.";
    yield put({type: "IDENTIFY_FACE_SUCCESSFUL", humanResult});
  } 
  catch(error) {
    yield put({type: "IDENTIFY_FACE_ERROR"});
  }
};

function detectFaces(photo) {
  const detectUrl = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true";

  const options = {
    method: "POST",
    body: photo,
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };

  return fetch(detectUrl, options)
           .then((response) => response.json());
};

function recogniseFaces(faceList) {
  const faceIds = faceList.map((face) => face.faceId);
  const identifyUrl = "https://westus.api.cognitive.microsoft.com/face/v1.0/identify";
  
  const body = {    
      "personGroupId": personGroup,
      "faceIds": faceIds,
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

  return fetch(identifyUrl, options)
          .then((response) => response.json());
};

export default function* rootSaga() {
  yield takeEvery("GET_MEDIA_SUCCESSFUL", onGetMediaSuccess);
  yield takeEvery("GET_MEDIA_REQUESTED", onGetMediaRequested);
  yield takeEvery("IDENTIFY_FACE_REQUESTED", onIdentifyFace);
}
