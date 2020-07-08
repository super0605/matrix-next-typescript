
import fs from 'fs';

export default async (req: import('next').NextApiRequest, res: import('next').NextApiResponse) => {
  try {
    const emptyMatrix = {
      "36months": {
          "lite": 0,
          "standard": 0,
          "unlimited": 0
      },
      "24months": {
          "lite": 0,
          "standard": 0,
          "unlimited": 0
      },
      "12months": {
          "lite": 0,
          "standard": 0,
          "unlimited": 0
      },
      "mtm": {
          "lite": 0,
          "standard": 0,
          "unlimited": 0
      }
    }
    fs.writeFile('./public/pricing.json', JSON.stringify(emptyMatrix), (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
    res.statusCode = 200
    res.json({message: 'success'})
  } catch(e) {
    console.error(e)
    if(e.isJoi) {
      res.statusCode = 422
      res.end('Error')
      return
    }
    res.statusCode = 500
    res.json({ message: 'Unknown Error' })
  }
}