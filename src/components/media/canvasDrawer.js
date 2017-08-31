import React from 'react';
import { connect } from 'react-redux';

class CanvasDrawer extends React.Component {
    componentWillReceiveProps(nextProps) {
      if (nextProps.captureMode) {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.drawImage(nextProps.state.videoElement, 0, 0, 500, 300);
        nextProps.onCanvasDraw(this.refs.canvas);
      }
    }
    render() {
      return (
        <canvas ref="canvas" width={500} height={300} style={{display: 'none'}}/>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    videoElement: state.videoElement,
    videoElementHeight: state.videoElementHeight,
    videoElementWidth: state.videoElementWidth,
    captureMode: state.captureMode
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCanvasDraw: (canvas) => {
      const lastCapturedImgData = canvas.toDataURL("image/png");
      canvas.toBlob((lastCapturedImgBlob) => {
        dispatch({type: 'CANVAS_CAPTURE_COMPLETE', lastCapturedImgData, lastCapturedImgBlob});
      });
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasDrawer)
