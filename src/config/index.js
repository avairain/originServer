export const table = ''
export const renderHTML = info => {
  info = info.filter(v => v.aab299 === '北京市' || v.aab299 === '上海市')
  let oHTML = ''
  info.forEach(v => {
    oHTML += `
      <tr>
        <td>${v.aab299 || '--'}</td>
        <td>${v.akb021 || '--'}</td>
        <td> ${v.akb020 || '--'}</td>
        <td>${initLevel(v.aka101).name || '--'}</td>
        <td>${initType(v.akb023).name || '--'}</td>
        <td>${v.aae006 || '--'}</td>
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
             <th>所属行政区</th>
             <th>医疗机构名称</th>
             <th>医疗机构编码</th>
             <th>医院等级</th>
             <th>医疗机构分类</th>
             <th>地址</th>
            </tr>
            ${oHTML}
          </table>
      </body>
    </html>
    `
  return html
}
const initType = id => {
  let arr = []
  arr.push({"id":"10","name":"医院"});
  arr.push({"id":"11","name":"综合医院"});
  arr.push({"id":"12","name":"中医医院"});
  arr.push({"id":"13","name":"中西医结合医院"});
  arr.push({"id":"14","name":"民族医院"});
  arr.push({"id":"15","name":"专科医院"});
  arr.push({"id":"16","name":"疗养院"});
  arr.push({"id":"17","name":"护理院（站）"});
  arr.push({"id":"20","name":"社区卫生服务中心（站）"});
  arr.push({"id":"21","name":"社区卫生服务中心"});
  arr.push({"id":"22","name":"社区卫生服务站"});
  arr.push({"id":"30","name":"卫生院"});
  arr.push({"id":"31","name":"街道卫生院"});
  arr.push({"id":"32","name":"乡镇卫生院"});
  arr.push({"id":"40","name":"门诊部、诊所、医务室、村卫生室"});
  arr.push({"id":"41","name":"门诊部"});
  arr.push({"id":"42","name":"诊所"});
  arr.push({"id":"43","name":"卫生所（室）"});
  arr.push({"id":"44","name":"医务室"});
  arr.push({"id":"45","name":"中小学卫生保健所"});
  arr.push({"id":"46","name":"村卫生室"});
  arr.push({"id":"50","name":"急救中心（站）"});
  arr.push({"id":"70","name":"妇幼保健院（所、站）"});
  arr.push({"id":"71","name":"妇幼保健院"});
  arr.push({"id":"72","name":"妇幼保健所"});
  arr.push({"id":"73","name":"妇幼保健站"});
  arr.push({"id":"74","name":"生殖保健中心"});
  arr.push({"id":"80","name":"专科病防治院（所、站）"});
  arr.push({"id":"81","name":"专科病防治院"});
  arr.push({"id":"82","name":"专科病防治院（站、中心）"})
  return arr.find(v => v.id === id) || {}
}

const initLevel = id => {
  const arr = []
  arr.push({"id":"01","name":"三级特等"});
  arr.push({"id":"02","name":"三级甲等"});
  arr.push({"id":"03","name":"三级乙等"});
  arr.push({"id":"04","name":"三级丙等"});
  arr.push({"id":"05","name":"二级甲等"});
  arr.push({"id":"06","name":"二级乙等"});
  arr.push({"id":"07","name":"二级丙等"});
  arr.push({"id":"08","name":"一级甲等"});
  arr.push({"id":"09","name":"一级乙等"});
  arr.push({"id":"10","name":"一级丙等"});
  arr.push({"id":"11","name":"无等级"});
  return arr.find(v => v.id === id) || {}
}
