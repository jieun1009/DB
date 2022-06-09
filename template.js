module.exports = {
    HTML:function(list){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <form action="/">
        
         <select name='movie_select'>
            <option value=''>-- 선택 --</option>
            <option value='title' selected>영화제목</option>
            <option value='director'>감독</option>
            <option value='actor'>배우</option>
            <option value='genre'>장르</option>
            <option value='year'>제작년도</option>
            <option value='nation'>국가</option>
        </select>
        <select name='movie_order'>
            <option value=''>-- 선택 --</option>
            <option value='korean' selected>가나다순</option>
            <option value='year'>년도순</option>
            <option value='rate'>평점순</option>
        </select>
        <input type="text" name="search"> 
        <input type="submit" value="검색">
    
    </form>
        
        ${list} 
      </body>
      </html>
      `;
    },list:function(result){
      var list = '<ul>';
      var i = 0;
      while(i < result.length){
        list = list +`<li><a href="/?id=${result[i].mno}"> ${result[i].m_title}</a></li><br>`; 
        i = i + 1;
      }list=list+"</ul>";
      return list;
      
    }
  }
  