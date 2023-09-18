<script>
  import jQuery from 'jquery';
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { assign } from 'lodash-es';

  const DEFAULT_LANGUAGE = {
    "sEmptyTable":"テーブルにデータがありません",
    "sInfo":" _TOTAL_ 件中 _START_ から _END_ まで表示",
    "sInfoEmpty":" 0 件中 0 から 0 まで表示",
    "sInfoFiltered":"",
    "sInfoPostFix":"",
    "sInfoThousands":",",
    "sLengthMenu":"_MENU_ 件表示",
    "sLoadingRecords":"読み込み中...",
    "sProcessing":"処理中...",
    "sSearch":"検索:",
    "sZeroRecords":"検索に一致するデータはありません。",
    "oPaginate": {
      "sFirst":"先頭",
      "sLast":"最終",
      "sNext":"次",
      "sPrevious":"前"
    },
    "oAria": {
      "sSortAscending":": 列を昇順に並べ替えるにはアクティブにする",
      "sSortDescending":": 列を降順に並べ替えるにはアクティブにする"
    },
    "select": {
      "rows": {
        _: "%d 件選択中",
        0: ""
      }
    }
  }

  /**
   * データソース。データの配列またはデータ取得関数
   * @type {(Object<string, any>[]|Function)}
   */
  export let data = [];
  /**
   * カラム定義
   * @type {Object<string, any>[]}
   */
  export let columns = [];
  /**
   * 自動カラム幅調整ON/OFF
   * @type {boolean}
   */
  export let autoWidth = false;
  /**
   * 修正言語リソース
   * @type {Object.<string, (string|Object<string,string>)>}
   */
  export let language = {};
  /**
   * 処理結果メッセージの表示/非表示(default:true)
   * @type {boolean}
  */
  export let info = true;
  /**
   * ソート順定義。[int:columnIndex, string:('asc'|'desc')]の配列として指定
   * @type {Array}
   */
  export let order = [];
  /**
   * 表示件数メニューリスト
   * @type {int[]}
   */
   export let lengthMenu = [10, 25, 50, 100];
  /**
   * ページングスタイル
   * @type {('numbers'|'simple'|'simple_numbers'|'full'|'full_numbers'|'first_last_numbers')}
  */
  export let pagingType = 'numbers'
  /**
   * ページングON/OFF
   * @type {boolean}
   */
  export let paging = true;
  /**
   * 1ページの表示件数
   * @type {number}
   */
  export let pageLength = 50;
  /**
   * 選択機能ON/OFF
   * @type {boolean}
   */
  export let select = false;
  /**
   * タブインデックス
   * @type {number}
  */
  export let tabIndex = 0;
  /**
   * 行生成コールバック
   */
  export let createdRow = null;
  /**
   * フッターコールバック
   * @type {Function}
   */
  export let footerCallback = null;
  /**
   * 検索文字列
   * @type {string}
   */
  export let searchText = '';

  const dispatcher = createEventDispatcher();

  let container;
  let observer;
  export let api = null;

  onDestroy(()=>{
    console.log('destroyed');
    if(api) {
      api.destroy();
      api = null;
    }
    if(observer) {
      observer.unobserve(container);
    }
  });
  onMount(()=>{
    console.log('mounted');
    observer = new ResizeObserver((entries)=>{
      //scrollX:true時のヘッダ描画不正対策
      if(api) {
        console.log('try adjustment');
        api.columns.adjust();
      }
    });
    observer.observe(container);

    return ()=>{
      console.log('cleanup');
    }
  });

  /**
   * @param {Object} data - unuse.
   * @param {Function} callback Datatable's callback function
   * @param {Object} [settings] - unuse
   */
  async function fetchData(_data, callback, settings) {
    try {
      let rows;
      if(typeof data !== 'function') {
        rows = data;
      } else {
        rows = await data();
      }
      callback(data);
      dispatcher('data_successed', rows);
    } catch(e) {
      callback([]);
      dispatcher('data_failed', e);
    }
  }

  $: if(container) {
    if(api) {
      jQuery(container).off();
      api.destroy();
    }
    api = jQuery(container).on('click', 'tbody td', (ev)=>{
      let row = api.row(ev.target);
      if(row.length > 0) {
        console.log('row clicked!!!!', row.data());
        ev.preventDefault();
        dispatcher('row_selected', row.data()); //Deprecated
        dispatcher('row_clicked', row.data());
      }
    }).DataTable({
      ajax: (arg1, callback, settings)=>{
        console.log('fetch data');
        new Promise(async (resolve, reject)=>{
          if(typeof data !== 'function') {
            resolve(data);
          } else {
            try {
              resolve(await data());
            } catch(e) {
              reject(e);
            }
          }
        }).then(data=>{
          console.log('data_complete', data);
          callback({data:data});
          dispatcher('data_completed', data);
        }).catch(reason=>{
          console.log('data_failed', reason);
          callback({data:[]})
          dispatcher('data_failed', reason);
        });
      },
      initComplete: ()=>{
        dispatcher('datatables_completed');
      },
      autoWidth: autoWidth,
      info: info,
      select: select,
      columns: columns,
      pageLength: pageLength,
      lengthMenu: lengthMenu,
      paging: paging,
      pagingType: pagingType,
      order: order,
      language: assign({}, DEFAULT_LANGUAGE, language),
      scrollX: true,
      search: {
        search: searchText
      },
      tabIndex: tabIndex,
      createdRow: createdRow,
      footerCallback: footerCallback
    });
    api.on('select', (e, dt, type, indexes)=>{
      log("select", e, "type: ", type, " indexes: ", indexes);
      indexes.forEach(i=>{
        let row = dt.row(i)
        let data = row.data();
        data._sort = 1;
        row.data(data);
      });
    }).on('deselect', (e, dt, type, indexes)=>{
      log("deselect", e, "type: ", type, " indexes: ", indexes);
      indexes.forEach(i=>{
        let row = dt.row(i)
        let data = row.data();
        delete data._sort;
        row.data(data);
      });
    });
  }
</script>

<table bind:this="{container}" class="table table-bordered table-striped table-selectable"></table>
