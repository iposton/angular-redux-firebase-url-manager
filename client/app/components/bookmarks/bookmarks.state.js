import { reject, uniqueId } from "lodash";
import database from '../../database';
import firebase from 'firebase';
// Constants

export const GET_BOOKMARKS = 'GET_BOOKMARKS';
export const GET_SELECTED_BOOKMARK = 'GET_SELECTED_BOOKMARK';
export const DELETE_BOOKMARK = 'DELETE_BOOKMARK';
export const CREATE_BOOKMARK = 'CREATE_BOOKMARK';
export const UPDATE_BOOKMARK = 'UPDATE_BOOKMARK';
export const RESET_SELECTED_BOOKMARK = 'RESET_SELECTED_BOOKMARK';

// Actions

// const URLS = {
//     FETCH: 'data/bookmarks.json'
// }

export const BookmarksActions = ($ngRedux, $http, $q) => {
    'ngInject';

    //const extract = result => result.data;

    const getBookmarks = () => {
        return (dispatch, getState) => {

            const { bookmarks } = getState();

            // GET DATA FROM FIREBASE REF AND MAKE AN ARRAY FOR NG-REPEAT
            return database.ref().once('value', snap => {

                const bookmarkArray = [];

                snap.forEach(function(item) {

                    // BUILD A CUSTOM OBJECT WITH KEY INSIDE FOR EDITING OR UPDATING SPECIFIC DATA KEY
                    const myBookmark = {
                        key: item.key,
                        category: item.val().bookmark.category,
                        id: item.val().bookmark.id,
                        title: item.val().bookmark.title,
                        url: item.val().bookmark.url
                    }

                    bookmarkArray.push(myBookmark);
                });
                dispatch({ type: GET_BOOKMARKS, payload: bookmarkArray });
            })


            //THIS IS HOW YOU GET DATA FROM DATA.JSON FILE IN APP

            //if (bookmarks.length) {
            // return $q.when(bookmarks)
            //  .then(() => dispatch({ type: GET_BOOKMARKS, payload: bookmarks }));
            //} else {
            //return $http.get(database.ref)
            //.then(extract)
            //.then((data) => dispatch({ type: GET_BOOKMARKS, payload: data }));

        }

    };



    const selectBookmark = (bookmark = initialBookmark) => {
        const { category } = $ngRedux.getState(),
            payload = bookmark.id ? bookmark : Object.assign({}, bookmark, { category: category.name });
        //delete payload.$$hashkey
        console.log(payload);
        return { type: GET_SELECTED_BOOKMARK, payload };
    };



    const saveBookmark = bookmark => {

        const hasId = bookmark.id,
            type = hasId ? UPDATE_BOOKMARK : CREATE_BOOKMARK;

        if (!hasId) {
            bookmark.id = uniqueId(100)

            const bookmarkRef = database.ref();
            bookmarkRef.push({
                bookmark
            })


        } else {

            // A post entry.
            const postData = {
                category: bookmark.category,
                id: bookmark.id,
                title: bookmark.title,
                url: bookmark.url
            };

            console.log(postData)

            // Get a key for a new Post.
            const newPostKey = bookmark.key;
            
            const updates = {};
            updates[newPostKey + '/bookmark/'] = postData;


            database.ref().update(updates);

        }


        return { type, payload: bookmark }
    };

    const deleteBookmark = bookmark => {
            return (dispatch) => { 
                // FIRST DELETE BOOKMARK FROM VIEW    
                dispatch({ type: DELETE_BOOKMARK, payload: bookmark })

                // Get a key for bookmark to delete.
                const deletePostKey = bookmark.key;
                
                const deleteBm = {};
                deleteBm[deletePostKey + '/bookmark/'] = bookmark = null;
                
                // DELETE DATA FROM FIREBASE REF
                database.ref().update(deleteBm)  
              
        }
    }

    const resetSelectedBookmark = () => {
        return { type: RESET_SELECTED_BOOKMARK }
    };

    return {

        getBookmarks,
        selectBookmark,
        deleteBookmark,
        saveBookmark,
        resetSelectedBookmark
    }
}

// Reducers
export const bookmarks = (state = [], { type, payload }) => {
    switch (type) {
        case GET_BOOKMARKS:
            return payload || state;
        case CREATE_BOOKMARK:
            return [...state, payload];
        case UPDATE_BOOKMARK:
            Object.freeze(state);
            return state.map(bookmark => bookmark.id === payload.id ? payload : bookmark);
        case DELETE_BOOKMARK:
            return state.filter(bookmark => bookmark.key !== payload.key);
        default:
            return state;
    }
};

const initialBookmark = { id: null, title: '', url: '', category: null };

export const bookmark = (state = initialBookmark, { type, payload }) => {
    switch (type) {
        case GET_SELECTED_BOOKMARK:
            return payload || state;
        case RESET_SELECTED_BOOKMARK:
            return initialBookmark;
        default:
            return state;
    }
};
