import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import Carousel from '../../../components/carousel/Carousel'
import useFetch from '../../../hooks/useFetch'
import './Trending.scss'

const mediaOptions = [
	{ id: 'movie', label: 'Movies' },
	{ id: 'tv', label: 'TV shows' },
	{ id: 'person', label: 'People' },
]

const Trending = () => {
	const [mediaType, setMediaType] = useState('movie')
	const [timeWindow, setTimeWindow] = useState('day')
	const peopleRail = useRef(null)
	const { data, loading } = useFetch(`/trending/${mediaType}/${timeWindow}`)
	const people = mediaType === 'person'

	useEffect(() => {
		peopleRail.current?.scrollTo({ left: 0 })
	}, [mediaType, timeWindow])

	const navigatePeople = (direction) => {
		const rail = peopleRail.current
		if (!rail) return
		rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: 'smooth' })
	}

	return (
		<section className="trendingSection">
			<ContentWrapper>
				<div className="trendingSection__header">
					<div>
						<p className="trendingSection__eyebrow">What everyone is watching</p>
						<h2 className="trendingSection__title">Trending</h2>
					</div>
					<div className="trendingSection__controls">
						<div className="trendingSection__tabs" role="tablist" aria-label="Trending category">
							{mediaOptions.map((option) => <button key={option.id} type="button" role="tab" aria-selected={mediaType === option.id} className={`trendingSection__tab ${mediaType === option.id ? 'trendingSection__tab--active' : ''}`} onClick={() => setMediaType(option.id)}>{option.label}</button>)}
						</div>
						<div className="trendingSection__tabs trendingSection__tabs--period" role="group" aria-label="Trending period">
							{['day', 'week'].map((period) => <button key={period} type="button" aria-pressed={timeWindow === period} className={`trendingSection__tab ${timeWindow === period ? 'trendingSection__tab--active' : ''}`} onClick={() => setTimeWindow(period)}>{period === 'day' ? 'Today' : 'This week'}</button>)}
						</div>
					</div>
				</div>
			</ContentWrapper>
			{people ? <div className="trendingPeopleSlider">
				<button className="trendingPeopleSlider__arrow trendingPeopleSlider__arrow--left" type="button" onClick={() => navigatePeople(-1)} aria-label="Previous trending people"><BsChevronLeft /></button>
				<div className="trendingPeople" aria-label="Trending people" ref={peopleRail}>
					{loading ? Array.from({ length: 6 }, (_, index) => <div className="trendingPeople__skeleton" key={index} />) : data?.results?.map((person) => <Link className="trendingPeople__card" to={`/person/${person.id}`} key={person.id}>
						<div className="trendingPeople__portrait">{person.profile_path ? <img src={`https://image.tmdb.org/t/p/w342${person.profile_path}`} alt="" loading="lazy" /> : <span>{person.name?.charAt(0)}</span>}</div>
						<strong>{person.name}</strong>
						<span>{person.known_for_department || 'Popular person'}</span>
					</Link>)}
				</div>
				<button className="trendingPeopleSlider__arrow trendingPeopleSlider__arrow--right" type="button" onClick={() => navigatePeople(1)} aria-label="Next trending people"><BsChevronRight /></button>
			</div> : <Carousel data={data?.results} loading={loading} endpoint={mediaType} />}
		</section>
	)
}

export default Trending
