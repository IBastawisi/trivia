import React, { useState } from 'react'
import { RouteComponentProps } from "@reach/router"

const Search: React.FC<RouteComponentProps & { submitSearch(searchTerm: string): void }> = (props) => {
  const [query, setQuery] = useState('');

  const getInfo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.submitSearch(query)
  }

  return (
    <form onSubmit={getInfo}>
      <input
        placeholder="Search questions..."
        onChange={e => setQuery(e.target.value)}
      />
      <input type="submit" value="Submit" className="button" />
    </form>
  )
}

export default Search
