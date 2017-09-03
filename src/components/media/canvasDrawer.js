import React from 'react';
import { connect } from 'react-redux';

class CanvasDrawer extends React.Component {
    componentWillReceiveProps(nextProps) {
      const { captureMode, videoElement, videoElementWidth, videoElementHeight } = nextProps;
      if (captureMode) {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, videoElementWidth, videoElementHeight);
        nextProps.onCanvasDraw(this.refs.canvas);
      }
    }
    render() {
      const { videoElementWidth, videoElementHeight, previewMode, identifyMode } = this.props;

      const canvasStyle = {
        display: ((previewMode || identifyMode) ? 'block' : 'none')
      };

      return (
        <canvas ref="canvas" width={videoElementWidth} height={videoElementHeight} style={canvasStyle}/>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    videoElement: state.videoElement,
    videoElementHeight: state.videoElementHeight,
    videoElementWidth: state.videoElementWidth,
    captureMode: state.captureMode,
    identifyMode: state.identifyMode,
    previewMode: state.previewMode
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCanvasDraw: (canvas) => {
      canvas.toBlob((lastCapturedImgBlob) => {
        dispatch({type: 'CANVAS_CAPTURE_COMPLETE', lastCapturedImgBlob});
      });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasDrawer)
