import React from 'react';
import { connect } from 'react-redux';
import { call, put } from 'redux-saga/effects';
import CanvasDrawer from '../media/canvasDrawer';

const App = (state) => {
  console.log('app state:', state);
  const {
    showVideo,
    showImage,
    onCanPlay,
    videoSrc,
    videoElementWidth,
    videoElementHeight,
    lastCapturedImgBlob,
    lastCapturedImgData,
    onTakePhoto,
    onStartover,
    onIdentify,
    resultContent,
    poseMode,
    previewMode,
    identifyMode
  } = state;

  const videoStyle = {
    display: (showVideo ? 'block' : 'none')
  };

  const imageStyle = {
    display: (showImage ? 'block' : 'none')
  };

  const buttonStyle = {
    marginRight: '15px'
  };

  return (
    <div>
      <header><h1>Is this Willman?</h1></header>

        <video id="video" style={videoStyle} onPlay={(e) => onCanPlay(e)} autoPlay src={videoSrc}>Video stream not available.</video>
        <img id="photo" style={imageStyle} width={videoElementWidth} height={videoElementHeight} alt="The screen capture will appear in this box." src={lastCapturedImgData}/>
      
      <div id="results">{resultContent}</div>
     
     {  (poseMode) && 
        <button id="startbutton" style={buttonStyle} onClick={() => onTakePhoto()}>Take photo</button>
     }

    {  (previewMode || identifyMode) &&
        <button id="startover" style={buttonStyle} onClick={() => onStartover()}>Startover</button>
    }

    {  (previewMode) && 
        <button id="identify"  style={buttonStyle} onClick={() => onIdentify(lastCapturedImgBlob)}>Identify!</button>
    }
      
      <CanvasDrawer state={state}/>

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
    showVideo: state.showVideo,
    showImage: state.showImage,
    lastCapturedImgData: state.lastCapturedImgData,
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
    onIdentify: (blob) => dispatch({type: 'IDENTIFY_FACE', photo: blob})
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
