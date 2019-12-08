import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { fetchPopRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav ({ selected, onUpdateLanguage }) {
  const languages = ['All', 'JavaScript', 'CSS', 'TypeScript', 'Dart', 'Swift', 'Ruby', 'Java', 'Kotlin', 'Python', 'Go', 'C', 'Rust', 'PHP', 'Liquid', 'Apex', 'BrightScript', 'SQL']
  return (
    <ul className="flex-center">
      {languages.map(language => (
        <li key={language}>
          <button
            className="btn-clear nav-link font-effect-anaglyph"
            style={language === selected ? { color: '#FF0000' } : null}
            onClick={() => onUpdateLanguage(language)}
          >
            {language}
          </button>
        </li>
      ))}
    </ul>
  )
}

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired
}

function RepoGrid ({ repos }) {
  return (
    <ul className='grid space-around'>
      {repos.map((repo, index) => {
        const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
        const { login, avatar_url } = owner
        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className="card-list">
                <li>
                  <Tooltip text="GitHub Username">
                    <FaUser color="#7FFFD4" size={22} />
                    <a href={`https://github.com/${login}`}>{login}</a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color="#F0E68C" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color="#FF69B4" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color="#00BFFF" size={22} />
                  {open_issues.toLocaleString()} open issues
                </li>
              </ul>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

export default class Popular extends Component {

  state = {
    selectedLanguage: 'All',
    repos: {},
    error: null
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }

  updateLanguage = (selectedLanguage) => {
    this.setState({
      selectedLanguage,
      error: null,
    })

    if (!this.state.repos[selectedLanguage]) {
      fetchPopRepos(selectedLanguage)
        .then((data) => {
          this.setState(({ repos }) => ({
            repos: {
              ...repos,
              [selectedLanguage]: data
            }
          }))
        })
        .catch(() => {
          console.log(`Error So Fetch:`, error)
          this.setState({
            error: `There was an error fetching them repos 😕`
          })
        })
    }
  }

  isLoading = () => {
    const { selectedLanguage, repos, error } = this.state
    return !repos[selectedLanguage] && error === null
  }

  render() {
    const { selectedLanguage, repos, error } = this.state

    return (
      <Fragment>
        <LanguagesNav 
          selected={selectedLanguage}
          onUpdateLanguage={this.updateLanguage}
        />
        {this.isLoading() && <Loading text="Fetching Dem Po's" />}
        {error && <p className="center-text error">{error}</p>}
        {repos[selectedLanguage] && <RepoGrid repos={repos[selectedLanguage]} />}
      </Fragment>
    )
  }
}