/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import ReactPlayer from 'react-player/youtube'

import './VideoPopup.scss'

const VideoPopup = ({ show, setShow, videoId, setVideoId }) => {
	const hidePopup = () => {
		setShow(false)
		setVideoId(null)
	}
	if (!show || !videoId) return null
	return (
		<div className="videoPopup visible" role="dialog" aria-modal="true" aria-label="Video player">
			<button className="opacityLayer" type="button" onClick={hidePopup} aria-label="Close video player"></button>
			<div className="videoPlayer">
				<button className="closeBtn" type="button" onClick={hidePopup}>
					Close
				</button>
				<ReactPlayer
					url={`https://www.youtube.com/watch?v=${videoId}`}
					controls
					width="100%"
					height="100%"
					playing={true}
				/>
			</div>
		</div>
	)
}

export default VideoPopup
