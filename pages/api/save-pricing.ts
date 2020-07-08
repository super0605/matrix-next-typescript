import * as Joi from '@hapi/joi'

import fs from 'fs';

// This is the JOI validation schema, you define
// all the validation logic in here, then run
// the validation during the request lifecycle.
// If you prefer to use your own way of validating the 
// incoming data, you can use it.
const schema = Joi.object<import('../../types').Matrix>({

})

export default async (req: import('next').NextApiRequest, res: import('next').NextApiResponse) => {
  try {
    // This will throw when the validation fails

    // const data = await schema.validateAsync(req.body, {
    //   abortEarly: false
    // }) as import('../../types').Matrix
    
    const data = JSON.parse(req.body)
    var valid = true;

    Object.keys(data).forEach(key => {

      if(isNaN(Number(data[key].lite))
       || isNaN(Number(data[key].standard))
       || isNaN(Number(data[key].unlimited))) {
        valid = false;
      }else {
        valid = true;
      }
      if(!valid) {
        res.statusCode = 422
        res.json({message: 'You should input number'})
        return
      }
    })
    
    if(valid){
      fs.writeFile('./public/pricing.json', req.body, (err) => {
        if (err) throw err;
        console.log('Data written to file');
      });
  
      res.statusCode = 200
      res.json({message: 'success'})
    }
   
  } catch(e) {
    console.error(e)
    if(e.isJoi) {
      // Handle the validation error and return a proper response
      res.statusCode = 422
      res.end('Error')
      return
    }
    res.statusCode = 500
    res.json({ error: 'Unknown Error' })
  }
}