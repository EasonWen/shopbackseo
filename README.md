# shopbackseo

使用NodeJS開發，過濾html是否符合seo優化條件

* Run Example

 node app.js strong=1 h1=2 url=http://www.google.com
 
 node app.js strong=1 h1= url=input.html

------------------------------------------------------------ 
*Step1 : 讀取 input.html 

*Step2 : 過濾tag規則如下 :

     <title> 是否沒有放 
	 
	 <meta name="descriptions"../> 是否沒有放
	 
	 <meta name="keywoeds"../> 是否沒有放
	 
     <img>:是否有少alt attribute
 
     <a>: 是否有少 rel attribute
 
     <strong> : 是否超過15個   
 
     <h1> : 是否超過1個        

 
*Step3 : console output:
  
     There are 1 <img> tag without alt attribute
   
     There are 1 <a> tag without rel attribute
   
     This HTML without <title> tag
   
     This HTML have more than one <h1> tag
