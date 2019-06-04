const express = require('express')
//Include our server libraries
const { VoyagerServer, gql } = require('@aerogear/voyager-server')

// Stub that reflects data source mapping
const employees = [{employee_id: 1, employee_name: "joe", cateory_id: 1 }, {employee_id: 2, employee_name: "john", cateory_id: 2}];

const categories = [{category_id: 1, employee_type:"Manager", security_clearance: 1}, {category_id: 2, employee_type:"Associate", security_clearance: 2}];

//GraphQL schema for mapping to data source mapping
const typeDefs = gql`
  type Employee {
      employee_id: ID!,
      employee_name: String!
      category: Category
  }
  type Category {
      category_id: ID!,
      employee_type: String!,
      security_clearance: ID!
  }
  type Query {
    listEmployees: [Employee]
  }
`

//Create the resolvers for your schema
const resolvers = {
  Query: {
    listEmployees: (obj, args, context, info) => {
      return employees;
    }
  },
  Employee: {
    category(employee) {
      return filter(categories, {category_id: employee.cateory_id});
    }
  }
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
