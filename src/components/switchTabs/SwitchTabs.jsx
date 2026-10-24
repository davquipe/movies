/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'

import './SwitchTabs.scss'

const SwitchTabs = ({ data, onTabChange }) => {
	const [selectedTab, setSelectedTab] = useState(0)
	const [left, setLeft] = useState(0)

	const activeTab = (tab, index) => {
		setLeft(index * 100)
		setSelectedTab(index)
		onTabChange(tab, index)
	}

	return (
		<div className="switchingTabs">
			<div className="tabItems">
				{data.map((tab, index) => (
					<span
						key={index}
						className={`tabItem ${
							selectedTab === index ? 'active' : ''
						}`}
						onClick={() => activeTab(tab, index)}>
						{tab}
					</span>
				))}
				<span className="movingBg" style={{ left }} />
			</div>
		</div>
	)
}

export default SwitchTabs
