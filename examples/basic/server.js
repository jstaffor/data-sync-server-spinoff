const express = require('express')
//Include our server libraries
const { VoyagerServer, gql } = require('@aerogear/voyager-server')

//Provide your graphql schema
const typeDefs = gql`
type Query {
  info: String!
  addressBook: [Person!]!
}

type Mutation {
  post(name: String!, address: String!): Person!
}

type Person {
  id: ID!
  address: String!
  name: String!
}
`

let persons = [{
  id: 'person-0',
  name: 'Alice Roberts',
  address: '1 Red Square, Waterford'
}]

let idCount = persons.length
const resolvers = {
  Query: {
    info: () => `This is a simple example`,
    addressBook: () => persons,
  },
  Mutation: {

    post: (parent, args) => {
       const person = {
        id: `person-${idCount++}`,
        address: args.address,
        name: args.name,
      }
      persons.push(person)
      return person
    }
  },
}

// The context is a function or object that can add some extra data
// That will be available via the `context` argument the resolver functions
const context = ({ req }) => {
  return {
    serverName: 'Voyager Server'
  }
}

// Initialize the voyager server with our schema and context
const server = VoyagerServer({
  typeDefs,
  resolvers,
  context
})

const app = express()
server.applyMiddleware({ app })

module.exports = { app, server }
