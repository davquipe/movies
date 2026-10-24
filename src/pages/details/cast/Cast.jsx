/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useSelector } from 'react-redux'

import './Cast.scss'

import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import Img from '../../../components/lazyLoadImage/Img'
import avatar from '../../../assets/images/avatar.png'
import { Link } from 'react-router-dom'

const Cast = ({ data, loading }) => {
	const { url } = useSelector((state) => state.home)

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
				<div className="sectionHeading">Top Cast</div>
				{!loading ? (
					<div className="listItems">
						{data?.map((item) => {
							let imgUrl = item.profile_path
								? url.profile + item.profile_path
								: avatar
							return (
								<Link key={item.id} to={`/person/${item.id}`} className="listItem" aria-label={`View ${item.name}'s profile`}>
									<div className="profileImg">
										<Img src={imgUrl} />
									</div>
									<div className="name">{item.name}</div>
									<div className="character">
										{item.character}
									</div>
								</Link>
							)
						})}
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
