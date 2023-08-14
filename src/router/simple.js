import { router } from '.';

import { defaultSimpleData } from '../constant'

const getPostData = (req) => new Promise(reslove => {
  const body = [];
  req.on('data', (e) => {
    body.push(e)
  })
  req.on('end', () => {
    try {
      const data = JSON.parse(Buffer.concat(body).toString());
      reslove(data);
    } catch (error) {
      res.send('unknow error', 500)
    }
  })
})

router.post('/simple/login', (req, res) => {
  getPostData(req).then(data => {
    res.send(JSON.stringify({ isAdmin: data.user === 'Tom' }));
  })
  .catch(err => {
    res.send('unknow error', 500)
  })
})

let simpleData = JSON.parse(JSON.stringify(defaultSimpleData));

router.post('/simple/list', (req, res) => {
  getPostData(req).then(data => {
    res.send(JSON.stringify({ list: simpleData }));
  })
  .catch(err => {
    res.send('unknow error', 500)
  })
})

router.delete('/simple/del', (req, res) => {
  getPostData(req).then(data => {
    console.log(data);
    simpleData = simpleData.filter(v => v.id !== data.id);
    res.send(JSON.stringify({ list: simpleData }));
  })
  .catch(err => {
    res.send('unknow error', 500)
  })
})
router.post('/simple/update', (req, res) => {
  getPostData(req).then(data => {
    console.log(data)
    const index = simpleData.findIndex(v => v.id === data.id);
    simpleData[index] = {
      id: data.id,
      info: data.info
    }
    res.send(JSON.stringify({ list: simpleData }));
  })
  .catch(err => {
    res.send('unknow error', 500)
  })
})