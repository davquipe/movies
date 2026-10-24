/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import './Cast.scss'

import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import Img from '../../../components/lazyLoadImage/Img'
import avatar from '../../../assets/images/avatar.png'
import { Link } from 'react-router-dom'

const Cast = ({ data, crew = [], loading }) => {
	const [creditType, setCreditType] = useState('cast')
	const [department, setDepartment] = useState('All departments')
	const { url } = useSelector((state) => state.home)
	const departments = useMemo(() => ['All departments', ...new Set(crew.map((item) => item.department).filter(Boolean))], [crew])
	const visibleCredits = creditType === 'cast' ? data || [] : crew.filter((item) => department === 'All departments' || item.department === department)

	const skeleton = () => {
		return (
			<div className="skItem">
				<div className="circle skeleton"></div>
				<div className="row skeleton"></div>
				<div className="row2 skeleton"></div>
			</div>
		)
	}
	return (
		<div className="castSection">
			<ContentWrapper>
				<div className="castSection__header">
					<div className="sectionHeading">Cast &amp; crew</div>
					<div className="castSection__controls">
						<div className="castSection__tabs" role="tablist" aria-label="Credits">
							{[{ id: 'cast', label: 'Cast' }, { id: 'crew', label: 'Crew' }].map((tab) => <button className={`castSection__tab ${creditType === tab.id ? 'castSection__tab--active' : ''}`} type="button" role="tab" aria-selected={creditType === tab.id} key={tab.id} onClick={() => { setCreditType(tab.id); setDepartment('All departments') }}>{tab.label}</button>)}
						</div>
						{creditType === 'crew' && departments.length > 1 && <label className="castSection__department" aria-label="Filter crew by department"><select value={department} onChange={(event) => setDepartment(event.target.value)}>{departments.map((item) => <option key={item}>{item}</option>)}</select></label>}
					</div>
				</div>
				{!loading ? (
					<div className="listItems">
						{visibleCredits.length ? visibleCredits.map((item) => {
							let imgUrl = item.profile_path
								? url.profile + item.profile_path
								: avatar
							return (
									<Link key={`${item.credit_id || item.id}-${item.job || item.character || ''}`} to={`/person/${item.id}`} className="listItem" aria-label={`View ${item.name}'s profile`}>
									<div className="profileImg">
										<Img src={imgUrl} />
									</div>
									<div className="name">{item.name}</div>
									<div className="character">
										{item.character || item.job}
									</div>
								</Link>
							)
						}) : <p className="castSection__empty">No {creditType === 'cast' ? 'cast' : 'crew'} credits are available here yet.</p>}
					</div>
				) : (
					<div className="castSkeleton">
						{skeleton()}
						{skeleton()}
						{skeleton()}
						{skeleton()}
						{skeleton()}
						{skeleton()}
					</div>
				)}
			</ContentWrapper>
		</div>
	)
}

export default Cast
