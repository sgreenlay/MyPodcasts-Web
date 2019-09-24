import React from 'react';
import ReactDOM from 'react-dom';
import './app.css';

import Config from './config.jsx'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const schema = {
    query: gql`
        query Podcast($url: String!) {
            podcast(url: $url) {
                title,
                image,
                episodes(count: 5) {
                    title,
                    url
                }
            }
        }
    `,
}

class List extends React.Component {
    render() {
        return (
            <div>
                <h1>Podcasts</h1>
                <ul className='tiles'>
                {
                    this.props.data.map(url => {
                        return (
                            <Query query={schema.query} variables={{ url : url}}>
                                {({ loading, error, data }) => {
                                    return (
                                        (loading || error) ? (
                                            <li className='tile' />
                                        ) : (
                                            <li className='tile loading' style={{
                                                backgroundImage: `url(${data.podcast.image})`,
                                                backgroundSize: 'cover',
                                            }} />
                                        )
                                    );
                                }}
                            </Query>
                        )
                    }) 
                }
                </ul>
            </div>
        )
    }
}

const httpLink = createHttpLink({
    uri: Config().uri
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

const podcasts = [
    "https://www.relay.fm/rd/feed",
    "http://adventurezone.libsyn.com/rss",
    "http://atp.fm/episodes?format=rss",
    "http://feeds.feedburner.com/mbmbam",
    "https://rss.simplecast.com/podcasts/2389/rss",
    "https://rss.simplecast.com/podcasts/1227/rss"
]

ReactDOM.render(
    <ApolloProvider client={client}>
        <List data={podcasts} />
    </ApolloProvider>,
    document.getElementById('app')
);
