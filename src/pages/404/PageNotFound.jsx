import { Helmet } from 'react-helmet-async'
import './PageNotFound.scss'

const PageNotFound = () => {
	const title = 'Page Not Found 🫤'
	return (
		<div>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			pageNotFound
		</div>
	)
}

export default PageNotFound
