import React from 'react';
import { connect } from 'react-redux';
import { call, put } from 'redux-saga/effects';
import CanvasDrawer from '../media/canvasDrawer';

const App = (state) => {
  const {
    onCanPlay,
    videoSrc,
    videoElementWidth,
    videoElementHeight,
    lastCapturedImgBlob,
    onTakePhoto,
    onStartover,
    onIdentify,
    resultContent,
    poseMode,
    previewMode,
    identifyMode
  } = state;

  const videoStyle = {
    display: ((poseMode && videoSrc) ? 'block' : 'none')
  };
  
  return (
    <div>
      <header><h1>Is this Willman?</h1></header>

      <video id="video" style={videoStyle} onPlay={(e) => onCanPlay(e)} autoPlay src={videoSrc}>Video stream not available.</video>
      <CanvasDrawer />

      <div id="results">{resultContent}</div>
     
       {  (poseMode && videoSrc) && 
          <button id="startbutton" onClick={() => onTakePhoto()}>Take photo</button>
       }

      {  (previewMode || identifyMode) &&
          <button id="startover" onClick={() => onStartover()}>Startover</button>
      }

      {  (previewMode) && 
          <button id="identify" onClick={() => onIdentify(lastCapturedImgBlob)}>Identify!</button>
      }

      <script src="bundle.js"></script>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    videoSrc: state.videoSrc,
    videoElement: state.videoElement,
    videoElementHeight: state.videoElementHeight,
    videoElementWidth: state.videoElementWidth,
    lastCapturedImgBlob: state.lastCapturedImgBlob,
    resultContent: state.resultContent,
    poseMode: state.poseMode,
    previewMode: state.previewMode,
    identifyMode: state.identifyMode
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCanPlay: (e) => dispatch({type: 'VIDEO_CAN_PLAY', video: e.target}),
    onTakePhoto: () => dispatch({type: 'ENTER_CAPTURE_MODE'}),
    onStartover: () => dispatch({type: 'RESET_APP'}),
    onIdentify: (blob) => dispatch({type: 'IDENTIFY_FACE_REQUESTED', photo: blob})
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
