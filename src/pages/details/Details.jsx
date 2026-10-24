// import { Helmet } from 'react-helmet-async'
import './Details.scss'
import useFetch from '../../hooks/useFetch'
import { useParams } from 'react-router-dom'
import DetailsBanner from './detailsBanner/DetailsBanner'
import Cast from './cast/Cast'
import VideosSection from './videosSection/VideoSection'
import Recommendation from './carousels/Recommendation'
import Similar from './carousels/Similar'
import WatchProviders from './WatchProviders'

const Details = () => {
	const { mediaType, id } = useParams()
	const { data, loading } = useFetch(`/${mediaType}/${id}/videos`)

	const { data: credits, loading: creditsLoading } = useFetch(
		`/${mediaType}/${id}/credits`,
	)

	return (
		<>
			<DetailsBanner video={data?.results?.[0]} crew={credits?.crew} />
			<div className="detailsExtra"><WatchProviders mediaType={mediaType} id={id} /></div>
			<Cast data={credits?.cast} loading={creditsLoading} />
			<VideosSection data={data} loading={loading} />
			<Similar mediaType={mediaType} id={id} />
			<Recommendation mediaType={mediaType} id={id} />
		</>
	)
}

export default Details
