# Team-2-workshop

#### Teamwork Distribution
| 李芳岐 (簡稱H, F2)                    | 李震瑋 (簡稱B)                            | 魏伊廷 (簡稱F1)                             |
|-------------------------------------|------------------------------------------|-------------------------------------------|
| repo host / deploy / map developer  | back-end code-base provider / developer  | front-end code-base provider / developer  |


#### 合作主題
##### [新增：我的收藏功能與頁面、個別景點地圖]


#### 工作初步流程

1. 由 H 先建立一個空的 index.html 作為 host repo ，有 main, develop branch

2. B 與 F1 fork host repo 到自己的 github repo，clone 到本機

3a. B 將所有後端程式新增到自己的 repo，發 merge 到 develop 的 PR 給 H
3b. F1 將所有前端程式新增到自己的 repo，發 merge 到 develop 的 PR 給 H

4. H confirm 兩個 PR， 組成一個有前後端程式的專案

5. deploy 到 H 的 EC2 上	


#### 工作細部流程

1. F1 與 F2 協調，確認 attraction.html 新增地圖功能上所需新增的 html 內容部分

2. 地圖功能由 F2 用 map.js 分開製作

3. a. 由 H 開立我的收藏功能所需的 get / post /delete api 規格與實作流程  https://app.swaggerhub.com/apis-docs/fangchi0209/favoriteAPI/1.0.0#/
3. b. H 與 F1, B 討論調整 api 規格

4. a. 由 B 負責我的收藏後端 db 建置與 api 建置
4. b. 由 F1 負責我的收藏前端串接 api 與 UI 圖示製作


#### [ To do list ]
##### F: 首頁加愛心
##### F: attraction page 加愛心
##### F: favorite page (html)
##### F: nav bar (include favorite page)
##### B: 新增 app.route("/favorite")
##### B: post / get / delete
##### B: table
##### H: 開 API (/api/favorite)
##### H+F: attraction.html 裡新增 map.js + 愛心.js
##### H: map.js GET 經緯度
##### B: 撰寫前後端工作流程


#### [ 網頁前後端動作 ]

1.景點被收藏
##### 前端：使用者點擊index attraction頁面愛心，先發GET user API判斷有沒有登入，有登入發POST給favorite API，沒登入出現登入面板
##### 後端：接受前端post資料，儲存到favorite table 成功回覆 {"ok": true} 200； 錯誤 400 403 500(類似booking api post錯誤內容)
##### 前端：收到後端回覆的post結果，成功就把愛心狀態改變為“收藏”狀態，沒成功不做動作

2.景點被取消收藏
##### 前端：使用者點擊index attraction favorite頁面愛心，發DELETE給favorite API
##### 後端：接受前端DELETE資料，將該景點資料由favorite table刪除，成功回覆 {"ok": true} 200； 錯誤 403(沒登入不給刪)
##### 前端：
 * index attraction頁面：收到後端回覆的delete結果，成功就把愛心狀態改變為“沒收藏”狀態，沒成功不做動作
 * favorite頁面：收到後端回覆的delete結果，成功就把愛心狀態改變為“沒收藏”狀態，沒成功不做動作

3.進入favorite頁面
##### 前端：進入頁面先判斷使用者是否登入，沒登入導回首頁，有登入，發GET給favorite API
##### 後端：收到前端請求，到favorite table把該使用者收藏的景點資料回覆給前端，成功回覆 {資料} 200；錯誤 403(沒登入不給資料)
##### 前端：前端收到回覆資料呈現頁面

4.index及attraction頁面
##### 前端：進入頁面先判斷使用者是否登入，有登入，發GET給favorite API
##### 後端：收到前端請求，到favorite table把該使用者收藏的景點資料回覆給前端，成功回覆 {資料} 200；錯誤 403(沒登入不給資料)
##### 前端：
 * index頁面：畫出每個景點時，確認那個景點的id是否有在後端回覆的資料內，有則呈現愛心狀態為“收藏”狀態，無則愛心狀態為“沒收藏”狀態
 * attraction頁面：確認該景點id是否有在後端回覆的資料內，有則呈現愛心狀態為“收藏”狀態，無則愛心狀態為“沒收藏”狀態

5.nav bar我的收藏
##### 前端：被點擊先發GET user API判斷有沒有登入，有登入導到favorite頁面，沒登入出現登入面板
##### 後端：判斷使用者是否登入


