import { Helmet } from 'react-helmet-async'
import './Explore.scss'

const Explore = () => {
	const title = 'Explore'
	return (
		<div>
			<Helmet>
				<title>{title}</title>
				<meta name="description" content="Explore movies" />
			</Helmet>
			Explore
		</div>
	)
}

export default Explore
