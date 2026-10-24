/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import avatar from '../../assets/images/avatar.png'
import './PersonResultCard.scss'

const PersonResultCard = ({ person }) => {
	const image = person.profile_path
		? `https://image.tmdb.org/t/p/w342${person.profile_path}`
		: avatar
	const knownFor = (person.known_for || [])
		.map((item) => item.title || item.name)
		.filter(Boolean)
		.slice(0, 3)

	return (
		<Link className="personResultCard" to={`/person/${person.id}`}>
			<div className="personResultCard__portrait">
				<img src={image} alt="" loading="lazy" />
			</div>
			<div className="personResultCard__info">
				<strong className="personResultCard__name">{person.name}</strong>
				<span className="personResultCard__department">{person.known_for_department || 'Person'}</span>
				{knownFor.length > 0 && <span className="personResultCard__knownFor">Known for {knownFor.join(', ')}</span>}
			</div>
			<span className="personResultCard__action" aria-hidden="true">View profile</span>
		</Link>
	)
}

export default PersonResultCard
