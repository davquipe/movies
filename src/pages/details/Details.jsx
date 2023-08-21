import { Helmet } from 'react-helmet-async'
import './Details.scss'

const Details = () => {
	const title = 'Details 🌝'
	return (
		<div>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			Details
		</div>
	)
}

export default Details
