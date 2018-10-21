import React from 'react'
import { Codepen, Github, Gitlab, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'react-feather'

const ProfileWebsites = ({ websites }) => {

    const renderIcons = () => {
        const icons = {
            codepen: Codepen,
            github: Github,
            gitlab: Gitlab,
            facebook: Facebook,
            twitter: Twitter,
            instagram: Instagram,
            linkedin: Linkedin,
            youtube: Youtube
        }

        let socialList = Object.keys(websites).map((key) => {
            let Icon = icons[key];
            return (
                <li key={`profile-${key}`}>
                    <a href={websites[key]} target="_blank" rel="noopener noreferrer">
                        <Icon />
                        <span className="hide-text">go to {key} page</span>
                    </a>
                </li>
            )
        })

        return <ul className="social-media">{ socialList }</ul>
    }

    if (Object.keys(websites).length > 0) {
        return renderIcons()
    }
    else {
        return ''
    }
}

export default ProfileWebsites