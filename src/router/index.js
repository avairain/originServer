import express from 'express';
const router = express.Router();
router.all('*', (req, res, next) => {
  console.log(req.path, req.method)
  if (req.path === '/' || req.path === '/index.html') {
    // fs.readFile(ps.join(__dirname, '../index.html'), (err, data) => {
    // if (err) throw err;
    // console.log(data)
    res.sendfile(ps.join(__dirname, '../public/index.html'))
    // })
  } else {
    res.append("Access-Control-Allow-Origin", "*");
    res.append("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.append("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.append("X-Powered-By", ' 3.2.1')
    res.append("Content-Type", "application/json;charset=utf-8");
    next()
  }
})
export { router }