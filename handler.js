'use strict';

const acorn = require('acorn')
const astring = require('astring')
const assert = require('assert')

module.exports.parsingData = async event => {
  let data = event.body
 

  let testCase = [
    {
      input: [
        ['bad', 'bAd', 'bad'],
        ['bad', 'bAd', 'bad'],
        ['bad', 'bAd', 'bad']
      ],
      output: "Fail!"
    },
    {
      input: [
        ['gOOd', 'bad', 'BAD', 'bad', 'bad'],
        ['bad', 'bAd', 'bad'],
        ['GOOD', 'bad', 'bad', 'bAd']
      ],
      output: "Publish!"
    },
    {
      input: [
        ['gOOd', 'bAd', 'BAD', 'bad', 'bad', 'GOOD'],
        ['bad'],
        ['gOOd', 'BAD']
      ],
      output: "I smell a series!"
    }
  ]
  
  let astFunction = acorn.parse(data).body
  const fnNode = astFunction.find(node => node.type === 'FunctionDeclaration' && node.id.name === 'well')
  if (!fnNode){
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Origin-Credentials": true,
      },
      body: JSON.stringify(
        {
          message: 'Name Function must be well',
          input: false,
        },
        null,
        2
      ),
    };
  }

  let params = fnNode.params.map(param => param.name)


  // return {
  //   statusCode: 200,
  //   headers: {
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Origin-Credentials": true,
  //   },
  //   body: JSON.stringify(
  //     {
  //       message: 'Great, You Are The Winner',
  //       input: params,
  //     },
  //     null,
  //     2
  //   ),
  // };
  
  const logic = new Function(...params, astring.generate(fnNode.body))

  

  try {
    for (let i = 0; i < testCase.length; i++){
      let test = logic(testCase[i].input)
      if(test !== testCase[i].output){
        throw new Error("Error")
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Origin-Credentials": true,
      },
      body: JSON.stringify(
        {
          message: 'Great, You Are The Winner',
          input: true,
        },
        null,
        2
      ),
    };
  }catch {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Origin-Credentials": true,
      },
      body: JSON.stringify(
        {
          message: 'Invalid Logic',
          input: false,
        },
        null,
        2
      ),
    };
  }


  
  // return {
  //   statusCode: 200,
  //   headers: {
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Origin-Credentials": true,
  //   },
  //   body: JSON.stringify(
  //     {
  //       message: 'Great, You Are The Winner',
  //       input: true,
  //     },
  //     null,
  //     2
  //   ),
  // };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
