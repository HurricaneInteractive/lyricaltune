import React from 'react'
import {
    Facebook,
    Twitter,
    Instagram
} from 'react-feather'

const links = [
    {
        to: 'https://www.facebook.com/',
        name: 'Facebook',
        icon: <Facebook />
    },
    {
        to: 'https://www.twitter.com/',
        name: 'Twitter',
        icon: <Twitter />
    },
    {
        to: 'https://www.instagram.com/',
        name: 'Instagram',
        icon: <Instagram />
    }
]

const SocialMedia = () => {
    return (
        <div className="social-media">
            <ul>
                {
                    links.map((item, key) => (
                        <li key={key}>
                            <a href={item.to} target="_blank" rel="noopener noreferrer" title={item.name}><span className="hide-text">{item.name}</span>{item.icon}</a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default SocialMedia