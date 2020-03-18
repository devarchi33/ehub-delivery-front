# PangPang CRUD Sample

## Step 1. 목록 조회 화면 만들기(Read) - [DataTables](https://datatables.net/) 버전

![List](http://git.elandsystems.com.cn:3000/attachments/58b897c2-9271-4073-b9da-818d8cdb58d0)

### API
* WebPack 서버에서 제공하는 Mock API 사용
* 북경 API Spec. 을 기준으로 작성

```JavaScript
// src/assets/api/sample/crud/list.json
{
  "result": {
    "items": [
      {
        "id": 1,
        "name": "Test101",
        "img": "test1.jpeg"
      },
      {
        "id": 2,
        "name": "Test 2",
        "img": "Test2.jpeg"
      },
      {
        "id": 3,
        "name": "Test_3",
        "img": "Test3.png"
      },
      {
        "id": 4,
        "name": "32122",
        "img": "321321"
      }
    ],
    "totalCount": 45
  },
  "success": true,
  "error": {}
}
```

### Router
* Router 생성

```javascript
// src/app/routes/sample/crud/index.js
export default {
  component: require('../layoutPage/components/Layout').default,

  childRoutes: [
    {
      path: 'sample-crud',
      getComponent(nextState, cb){
        System.import('./containers/List').then((m)=> {
          cb(null, m.default)
        })
      }
    },
  ]
};
```
* Container Component 생성

```javascript
// src/app/routes/sample/crud/containers/List.js
import React from 'react'
import Datatable from "../../../../components/tables/Datatable";
export default class List extends React.Component {
    
    render() {
        return (
            <div id="content">
                <div className="row">
                    <article className="col-sm-12">
                        <div>
                            <Datatable
                                options={{
                                    serverSide: true,
                                    sAjaxSource: "/assets/api/sample/crud/list.json",
                                    fnServerData: function (sSource, aoData, fnCallback) {
                                        let skipCount = aoData[3].value;
                                        let maxResultCount = aoData[4].value;
                                        let url = sSource + '?maxResultCount=' + maxResultCount + '&skipCount=' + skipCount;

                                        $.getJSON(url, function (json) {
                                            let dataTableData = {
                                                recordsTotal: json.result.totalCount,
                                                recordsFiltered: json.result.totalCount,
                                                data: json.result.items
                                            };
                                            fnCallback(dataTableData);
                                        })
                                    },
                                    columns: [{data: "id"}, {data: "name"}, {data: "img"}, {
                                        "targets": -1,
                                        "data": null,
                                        "defaultContent": "<button>Click!</button>"
                                    }]
                                }}
                                paginationLength={true} className="table table-striped table-bordered table-hover"
                                width="100%">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>
                                        <i className="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs"/>
                                        Name
                                    </th>
                                    <th>Image Url</th>
                                    <th></th>
                                </tr>
                                </thead>
                            </Datatable>
                        </div>
                    </article>
                </div>
            </div>
        )
    }
}
```

* Router 연결

```javascript
// src/app/app.js
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {syncHistoryWithStore} from 'react-router-redux'
import {Router, hashHistory} from 'react-router'

import store from './store/configureStore'

const history = syncHistoryWithStore(hashHistory, store);

const routes = {
  path: '/',
  indexRoute: { onEnter: (nextState, replace) => replace('/home') },
  childRoutes: [
    require('./routes/home').default,
    require('./routes/sample/crud').default,
  ]
};

ReactDOM.render((
  <Provider store={store}>
    <Router
      history={history}
      routes={routes}
    />
  </Provider>
), document.getElementById('root'));

```

### 좌측 메뉴 연결

```javascript
// src/app/config/navigation.json
{
  "items": [
    {
        "title":"Home",
        "route":"home",
        "icon":"fa fa-lg fa-fw fa-home"
    },
    {
        "title":"CRUD Sample",
        "route":"sample-crud",
        "icon":"fa fa-lg fa-fw fa-table"
    }

  ]
}
```