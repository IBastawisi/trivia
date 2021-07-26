import React, { useState } from 'react'
import { RouteComponentProps } from "@reach/router"

const Search: React.FC<RouteComponentProps & { submitSearch(searchTerm: string): void }> = (props) => {
  const [query, setQuery] = useState('');

  const getInfo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.submitSearch(query)
  }

  return (
    <form className="form-inline flex-nowrap my-2" onSubmit={getInfo}>
      <input className="form-control w-100 flex-grow-1"
        placeholder="Search questions..."
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit" className="btn btn-outline-success flex-shrink-0">Submit</button>
    </form>
  )
}

export default Search
