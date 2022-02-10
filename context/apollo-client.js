import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  // TODO: add it from env
  // uri: 'http://localhost:1337/graphql',
  uri: 'https://stop2camp.herokuapp.com/graphql',
  cache: new InMemoryCache(),
});

export { client };
