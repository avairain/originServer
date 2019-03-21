export const table = ''
export const renderHTML = info => {

  let oHTML = ''
  info.forEach(v => {
    oHTML += `
      <tr>
        <td>${v.aab299}</td>
        <td>${v.akb021}</td>
        <td>${v.aae006}</td>
        <td>'${v.akb020}</td>
        <td>'${v.aae005}</td>
      </tr>
    `
  });
  let html = `
        <html>
          <head>
            <meta charset='utf-8' />
            <style>
              .tableA {
                border-collapse: collapse;
              }
              .tableA .title th{
                height: 50px;
                font-size: 24px;
                font-family: '微软雅黑';
                font-weight: 700;
              }
              .tableA tr th {
                border: 1px #000 solid;
                height: 40px;
                background: #efefef;
              }
              .tableA tr td {
                padding: 0 40px;
                border: 1px #000 solid;
                height: 40px;
                text-align: center;
              }
              .tableA .footer td {
                font-size: 20px;
                font-weight: 700;
              }
            </style>
          </head>
          <body>
              <table class="tableA">
                <tr>
                 <th>城市</th>
                 <th>医院名称</th>
                 <th>地址</th>
                 <th>电话</th>
                 <th>医疗机构编码</th>
                </tr>
                ${oHTML}
              </table>
          </body>
        </html>
        `
  return html
}